import React from 'react'
import { Receipt } from 'lucide-react'
import type { CompanyInfo } from './types'
interface InvoiceHeaderProps {
  invoice: any
  companyInfo: CompanyInfo | null
}
export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice, companyInfo }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] print:grid-cols-[1fr_auto] items-start gap-8 mb-6'>
      <div className='flex gap-4 min-w-0'>
        <div className='shrink-0 print:hidden'>
          <div className='w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200'>
            {companyInfo?.logo ? (
              <img src={companyInfo.logo} alt='Logo' className='w-full h-full object-cover rounded-xl' />
            ) : (
              <Receipt className='w-8 h-8 text-white' />
            )}
          </div>
        </div>
        <div>
          <h1 className='text-3xl font-black tracking-tight uppercase leading-none mb-1 text-blue-700'>
            {companyInfo?.name || 'EVER TRADING LANKA'}
          </h1>
          <p className='text-xs font-bold text-slate-600 tracking-[0.1em] uppercase mb-3 leading-none'>
            I N V E N T O R Y & S A L E S M A N A G E M E N T
          </p>
          <div className='text-[13px] text-slate-700 font-medium space-y-0.5 leading-tight'>
            <p>{companyInfo?.address || 'Anhettigama Thannahena, Dehiowita'}</p>
            <div className='flex flex-col'>
               <div className='flex items-center gap-2'>
                 <span className='font-bold'>Contact:</span>
                 <span>{companyInfo?.phone || '0765664989 | 0710604169'}</span>
               </div>
               <div className='italic text-slate-500 text-xs mt-0.5'>
                 {companyInfo?.email || 'evertradinglanka@gmail.com'}
               </div>
            </div>
          </div>
        </div>
      </div>
      <div className='justify-self-end text-right flex flex-col items-end'>
        <div className='bg-blue-700 text-white px-5 py-1.5 rounded-md mb-2 inline-block'>
          <h2 className='text-xl font-bold tracking-widest uppercase'>Invoice</h2>
        </div>
        <div className='space-y-1'>
          <div className='flex flex-col items-end leading-none'>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Serial Number</span>
            <p className='text-lg font-black text-slate-900 tracking-tight'>#{invoice.invoice_no}</p>
          </div>
          <div className='mt-2 flex flex-col items-end leading-none'>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Date of Issue</span>
            <p className='font-bold text-slate-800 text-sm'>
              {new Date(invoice.invoice_date || new Date()).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
