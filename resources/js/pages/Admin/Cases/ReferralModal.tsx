import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import { useEffect } from "react";

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: number | null;
    caseType: string;
    onSuccess: () => void;
}

export default function ReferralModal({ isOpen, onClose, caseId, caseType, onSuccess }: ReferralModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        id: caseId,
        type: caseType,
        referral_to: '',
        referral_notes: '',
    });

    // Update form data when props change
    useEffect(() => {
        setData(d => ({ ...d, id: caseId, type: caseType }));
    }, [caseId, caseType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!caseId) return;

        post(route('admin.cases.refer'), {
            onSuccess: () => {
                toast.success("Case Referred Successfully", {
                    description: `Referral recorded for ${data.referral_to}`
                });
                onSuccess();
                onClose();
                reset();
            },
            onError: () => {
                toast.error("Failed to refer case");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Issue Referral Order</DialogTitle>
                    <DialogDescription>
                        Direct this case to a partner agency. The system will track this status and generate necessary documentation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="agency">Referral Agency</Label>
                        <Select onValueChange={(val) => setData('referral_to', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Agency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PNP - Women & Children Desk">PNP - Women & Children Desk</SelectItem>
                                <SelectItem value="DSWD / CSWDO">DSWD / City Social Welfare</SelectItem>
                                <SelectItem value="PAO (Public Attorney)">PAO (Public Attorney's Office)</SelectItem>
                                <SelectItem value="Barangay Lupon">Barangay Lupon (Conflict Resolution)</SelectItem>
                                <SelectItem value="Medical / Hospital">Medical Institution</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.referral_to && <span className="text-red-500 text-xs">{errors.referral_to}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Remarks / Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add specific instructions or context for the referral..."
                            value={data.referral_notes}
                            onChange={(e) => setData('referral_notes', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={processing} className="bg-[#ce1126] hover:bg-red-700 text-white">
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Referral
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
