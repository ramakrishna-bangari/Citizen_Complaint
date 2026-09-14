import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock3,
    History,
    RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaintHistory } from "../../../api/complaintApi";

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

function OfficerComplaintHistory() {
    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getComplaintHistory(complaintId);

            if (Array.isArray(data)) {
                setHistory(data);
            } else if (Array.isArray(data?.content)) {
                setHistory(data.content);
            } else if (Array.isArray(data?.data)) {
                setHistory(data.data);
            } else {
                setHistory([]);
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to load complaint history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [complaintId]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() =>
                            navigate(`/officer/complaints/${complaintId}`)
                        }
                        className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
                    >
                        <ArrowLeft size={16} />
                        Back to complaint
                    </button>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Complaint History
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Activity for complaint #{complaintId}
                    </p>
                </div>

                <button
                    onClick={loadHistory}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600"
                >
                    <RefreshCw size={17} />
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-16 animate-pulse rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="py-16 text-center">
                        <History
                            size={42}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-4 font-semibold text-slate-700">
                            No history available
                        </p>
                    </div>
                ) : (
                    <div className="relative space-y-7">
                        <div className="absolute bottom-4 left-4 top-4 w-px bg-slate-200" />

                        {history.map((item, index) => (
                            <div
                                key={item?.id ?? `history-${index}`}
                                className="relative flex gap-4"
                            >
                                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                                    <Clock3
                                        size={15}
                                        className="text-slate-600"
                                    />
                                </div>

                                <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-bold text-slate-900">
                                            {item?.status || "Status updated"}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatDate(
                                                item?.updatedAt ??
                                                item?.createdAt
                                            )}
                                        </p>
                                    </div>

                                    {item?.remarks && (
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.remarks}
                                        </p>
                                    )}

                                    {item?.updatedBy && (
                                        <p className="mt-2 text-xs font-medium text-slate-400">
                                            Updated by {item.updatedBy}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OfficerComplaintHistory;