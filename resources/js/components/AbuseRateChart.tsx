
import { ShieldAlert } from 'lucide-react';

export default function AbuseRateChart({ analyticsData, maxVal = 25 }: { analyticsData: any[], maxVal?: number }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-600" /> Rate of Women's Abuse by Month (CY 2024)
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 justify-end">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-3 h-3 bg-red-600 rounded-sm"></div> Physical</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-3 h-3 bg-purple-600 rounded-sm"></div> Sexual</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Psychological</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Economic</div>
            </div>

            {/* Bar Chart Container */}
            <div className="relative h-80 w-full overflow-x-auto">
                <div className="flex items-end justify-between h-full min-w-[600px] gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 px-2">
                    {analyticsData.map((data, i) => (
                        <div key={i} className="flex flex-col justify-end h-full w-full gap-1 group relative">
                            <div className="flex gap-[1px] h-full items-end justify-center w-full">

                                {/* Physical */}
                                <div className="w-2 bg-red-600 rounded-t-sm hover:opacity-80 transition-all relative group/bar" style={{ height: `${(data.physical / maxVal) * 100}%` }}>
                                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] p-1 rounded z-10">{data.physical}</div>
                                </div>
                                {/* Sexual */}
                                <div className="w-2 bg-purple-600 rounded-t-sm hover:opacity-80 transition-all relative group/bar" style={{ height: `${(data.sexual / maxVal) * 100}%` }}>
                                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] p-1 rounded z-10">{data.sexual}</div>
                                </div>
                                {/* Psychological */}
                                <div className="w-2 bg-orange-500 rounded-t-sm hover:opacity-80 transition-all relative group/bar" style={{ height: `${(data.psychological / maxVal) * 100}%` }}>
                                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] p-1 rounded z-10">{data.psychological}</div>
                                </div>
                                {/* Economic */}
                                <div className="w-2 bg-emerald-500 rounded-t-sm hover:opacity-80 transition-all relative group/bar" style={{ height: `${(data.economic / maxVal) * 100}%` }}>
                                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] p-1 rounded z-10">{data.economic}</div>
                                </div>

                            </div>
                            <span className="text-[10px] font-black text-slate-400 text-center mt-2">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
