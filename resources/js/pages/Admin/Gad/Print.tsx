
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface GadActivity {
    id: number;
    title: string;
    activity_type: string;
    date_scheduled: string;
    actual_expenditure: number;
    target_participants: any;
}

interface PrintProps {
    activities: GadActivity[];
    year: string | number;
    totalUtilized: number;
}

export default function GadPrint({ activities, year, totalUtilized }: PrintProps) {
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white text-black font-serif">
            <Head title={`GAD Accomplishment Report ${year}`} />

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold uppercase">Barangay 183 Villamor</h1>
                <h2 className="text-xl font-bold uppercase mt-2">Gender and Development (GAD) Accomplishment Report</h2>
                <p className="text-sm mt-1">Fiscal Year {year}</p>
            </div>

            <table className="w-full border-collapse border border-black mb-8 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black px-4 py-2 text-left">Activity / Program</th>
                        <th className="border border-black px-4 py-2 text-left">Type</th>
                        <th className="border border-black px-4 py-2 text-center">Date</th>
                        <th className="border border-black px-4 py-2 text-right">Actual Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <tr key={activity.id}>
                                <td className="border border-black px-4 py-2">
                                    <div className="font-bold">{activity.title}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Participants: {Array.isArray(activity.target_participants) ? activity.target_participants.join(', ') : 'N/A'}
                                    </div>
                                </td>
                                <td className="border border-black px-4 py-2">{activity.activity_type}</td>
                                <td className="border border-black px-4 py-2 text-center">
                                    {new Date(activity.date_scheduled).toLocaleDateString()}
                                </td>
                                <td className="border border-black px-4 py-2 text-right">
                                    ₱{Number(activity.actual_expenditure).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="border border-black px-4 py-8 text-center italic">
                                No completed activities found for this year.
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className="font-bold bg-gray-50">
                        <td colSpan={3} className="border border-black px-4 py-2 text-right uppercase">Total GAD Utilization</td>
                        <td className="border border-black px-4 py-2 text-right">
                            ₱{Number(totalUtilized).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="mt-16 grid grid-cols-2 gap-8">
                <div className="text-center">
                    <p className="mb-8 border-b border-black w-2/3 mx-auto"></p>
                    <p className="font-bold">Prepared By</p>
                    <p className="text-xs uppercase">GAD Focal Person</p>
                </div>
                <div className="text-center">
                    <p className="mb-8 border-b border-black w-2/3 mx-auto"></p>
                    <p className="font-bold">Noted By</p>
                    <p className="text-xs uppercase">Barangay Captain</p>
                </div>
            </div>

            <div className="mt-8 text-center print:hidden">
                <p className="text-gray-500 text-sm mb-4">Click print if the dialog doesn't appear automatically.</p>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Print Report
                </button>
            </div>
        </div>
    );
}
