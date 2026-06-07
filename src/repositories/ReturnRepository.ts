import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// เราจะไม่ประกาศตัวแปร supabase ไว้ข้างบนสุดแบบนั้น
// แต่เราจะสร้างฟังก์ชันที่ดึงค่าจาก process.env "เมื่อถูกเรียกใช้งานเท่านั้น"
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase Environment Variables");
  }

  return createClient(url, key);
};

/**
 * ฟังก์ชันช่วยแปลงวันที่สำหรับตาราง Database
 */
const sanitizeDate = (date: any) => {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

export const ReturnRepository = {
  async getNextDocNumber() {
    const supabase = getSupabase(); // เรียกตรงนี้
    const { data, error } = await supabase
      .from('requests')
      .select('doc_number')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
  
    if (error) {
      console.error("Error fetching doc_number:", error);
      return "S001/2026";
    }

    if (!data) return "S001/2026"; 

    const lastNum = parseInt(data.doc_number.split('/')[0].replace('S', ''));
    const nextNum = (lastNum + 1).toString().padStart(3, '0');
    return `S${nextNum}/2026`;
  },
  
  /**
   * บันทึกข้อมูลใบคำขอทั้งหมดลง Supabase
   */
  async createReturnRequest(data: any) {
    const supabase = getSupabase(); // เรียกตรงนี้
    const refId = nanoid(10).toUpperCase();

    // บันทึกที่ตาราง requests
    const { data: request, error: requestError } = await supabase
      .from('requests')
      .insert({
        ref_id: refId,
        request_date: new Date().toISOString(),
        request_type: data.sender?.return_type || 'ทั่วไป',
        hospital_name: data.sender?.hospital_name,
        province: data.sender?.province,
        doc_number: data.sender?.doc_number,
        return_reason: data.returnReason,
        delivery_type: data.deliveryType,
        addr_street: data.addrStreet,
        addr_district: data.addrDistrict,
        addr_sub: data.addrSub,
        addr_province: data.addrProvince,
        agent_info: data.agentInfo,
        customer_email: 'user@email.com', 
        overall_status: 'pending',
        total_value: Number(data.totalValue) || 0,
        signature_url: data.sigImage,
        signer_name: data.sigFullname,
        signer_position: data.sigPosition,
        exchange_product_type: data.exchangeProductType,
        exchange_product_list: Array.isArray(data.exchangeProductList) ? JSON.stringify(data.exchangeProductList) : null,
        exchange_product_other: data.exchangeProductOther
      })
      .select('id')
      .single();

    if (requestError) {
      console.error("Error inserting request:", requestError);
      throw requestError;
    }

    // บันทึกรายการยา
    if (data.items && data.items.length > 0) {
      const itemsToInsert = data.items.map((item: any) => ({
        request_id: request.id,
        drug_name: item.drugName,
        qty: Number(item.qty) || 0,
        unit: item.unit,
        lot_number: item.lot,
        exp_date: sanitizeDate(item.exp),
        value_amount: Number(item.value) || 0,
        invoice_number: item.invoiceNumber,
        product_type: item.productType || 'ทั่วไป',
        exp_status: item.expStatus
      }));

      const { error: itemsError } = await supabase
        .from('drug_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error inserting items:", itemsError);
        throw itemsError;
      }
    }

    return { refId };
  }
};