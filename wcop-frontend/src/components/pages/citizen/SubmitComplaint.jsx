import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    FileImage,
    LoaderCircle,
    MapPin,
    Send,
    Upload,
    X,
} from "lucide-react";

import {
    createComplaint,
} from "../../../api/complaintApi";

import {
    getAllDistricts,
} from "../../../api/districtApi";

import {
    uploadComplaintImage,
} from "../../../api/cloudinaryApi";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

function SubmitComplaint() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        districtId: "",
        location: "",
        latitude: "",
        longitude: "",
    });

    const [districts, setDistricts] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(true);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [locating, setLocating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDistricts = async () => {
            try {
                setLoadingDistricts(true);
                setError("");

                const response = await getAllDistricts();

                if (!mounted) {
                    return;
                }

                const list = Array.isArray(response)
                    ? response
                    : response?.content ||
                    response?.data ||
                    [];

                setDistricts(list);
            } catch (error) {
                if (!mounted) {
                    return;
                }

                setError(
                    error?.response?.data?.message ||
                    "Unable to load districts."
                );
            } finally {
                if (mounted) {
                    setLoadingDistricts(false);
                }
            }
        };

        loadDistricts();

        return () => {
            mounted = false;
        };
    }, []);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const getCurrentLocation = () => {
        setError("");

        if (!navigator.geolocation) {
            setError(
                "Location services are not supported by this browser."
            );

            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {
                    latitude,
                    longitude,
                } = position.coords;

                setForm((previous) => ({
                    ...previous,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                }));

                setLocating(false);
            },
            (locationError) => {
                let message =
                    "Unable to get your current location.";

                if (
                    locationError.code ===
                    locationError.PERMISSION_DENIED
                ) {
                    message =
                        "Location permission was denied. You can enter the location manually.";
                } else if (
                    locationError.code ===
                    locationError.POSITION_UNAVAILABLE
                ) {
                    message =
                        "Your current location could not be determined.";
                } else if (
                    locationError.code ===
                    locationError.TIMEOUT
                ) {
                    message =
                        "Location request timed out. Please try again.";
                }

                setError(message);
                setLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setError("");

        if (
            !ACCEPTED_FILE_TYPES.includes(
                selectedFile.type
            )
        ) {
            setError(
                "Please select a JPG, PNG, WEBP image or MP4, WEBM, MOV video."
            );

            event.target.value = "";

            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("File size cannot exceed 20 MB.");

            event.target.value = "";

            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setFile(selectedFile);

        const objectUrl =
            URL.createObjectURL(selectedFile);

        setPreviewUrl(objectUrl);
    };

    const removeFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setFile(null);
        setPreviewUrl("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            return "Complaint title is required.";
        }

        if (form.title.trim().length < 5) {
            return "Complaint title must contain at least 5 characters.";
        }

        if (!form.description.trim()) {
            return "Complaint description is required.";
        }

        if (form.description.trim().length < 10) {
            return "Please provide enough details about the complaint.";
        }

        if (!form.districtId) {
            return "Please select your district.";
        }

        if (!form.location.trim()) {
            return "Complaint location is required.";
        }

        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);

            return;
        }

        try {
            setSubmitting(true);

            let imageUrl = null;

            if (file) {
                setUploading(true);

                imageUrl =
                    await uploadComplaintImage(
                        file
                    );

                setUploading(false);
            }

            const complaintData = {
                title: form.title.trim(),
                description: form.description.trim(),
                districtId: Number(form.districtId),
                location: form.location.trim(),
                latitude: form.latitude
                    ? Number(form.latitude)
                    : null,
                longitude: form.longitude
                    ? Number(form.longitude)
                    : null,
                imageUrl: imageUrl || null,
            };

            const response =
                await createComplaint(
                    complaintData
                );

            setSuccess(
                "Your complaint has been submitted successfully."
            );

            const complaintId =
                response?.id ||
                response?.data?.id;

            setTimeout(() => {
                if (complaintId) {
                    navigate(
                        `/citizen/complaints/${complaintId}`,
                        {
                            replace: true,
                        }
                    );
                } else {
                    navigate(
                        "/citizen/complaints",
                        {
                            replace: true,
                        }
                    );
                }
            }, 700);
        } catch (error) {
            setUploading(false);

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to submit your complaint. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="mt-5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Submit a Complaint
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Provide the details of the public-service
                    issue you would like to report.
                </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5 sm:p-7 lg:p-8">
                    {error && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            <CheckCircle2 size={19} />

                            <span>{success}</span>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Complaint Title
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                maxLength={200}
                                placeholder="Enter a brief complaint title"
                                required
                                disabled={submitting}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-xs text-slate-400">
                                    {form.title.length}/200
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Description
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={5000}
                                rows={7}
                                placeholder="Describe the issue clearly and provide relevant details."
                                required
                                disabled={submitting}
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-xs text-slate-400">
                                    {form.description.length}/5000
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="districtId"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                District
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="districtId"
                                name="districtId"
                                value={form.districtId}
                                onChange={handleChange}
                                disabled={
                                    loadingDistricts ||
                                    submitting
                                }
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                                <option value="">
                                    {loadingDistricts
                                        ? "Loading districts..."
                                        : "Select district"}
                                </option>

                                {districts.map(
                                    (district) => (
                                        <option
                                            key={district.id}
                                            value={district.id}
                                        >
                                            {
                                                district.districtName
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {!loadingDistricts &&
                                districts.length === 0 && (
                                    <p className="mt-2 text-xs text-red-600">
                                        No districts are available.
                                    </p>
                                )}
                        </div>

                        <div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label
                                    htmlFor="location"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Complaint Location
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={
                                        getCurrentLocation
                                    }
                                    disabled={
                                        locating ||
                                        submitting
                                    }
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
                                >
                                    {locating ? (
                                        <>
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                            Getting location...
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={15} />
                                            Use my location
                                        </>
                                    )}
                                </button>
                            </div>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Enter the location where the issue occurred"
                                required
                                disabled={submitting}
                                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="latitude"
                                    className="mb-2 block text-xs font-semibold text-slate-500"
                                >
                                    Latitude
                                </label>

                                <input
                                    id="latitude"
                                    type="text"
                                    value={
                                        form.latitude ||
                                        "Not available"
                                    }
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="longitude"
                                    className="mb-2 block text-xs font-semibold text-slate-500"
                                >
                                    Longitude
                                </label>

                                <input
                                    id="longitude"
                                    type="text"
                                    value={
                                        form.longitude ||
                                        "Not available"
                                    }
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                                />
                            </div>
                        </div>

                        <p className="-mt-3 text-xs leading-5 text-slate-400">
                            Location coordinates are optional.
                            You can use your current location
                            to automatically capture them.
                        </p>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Supporting Image or Video
                            </label>

                            {!file ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={submitting}
                                    className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <Upload size={22} />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        Upload supporting evidence
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        JPG, PNG, WEBP, MP4,
                                        WEBM or MOV · Maximum
                                        20 MB
                                    </p>
                                </button>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    {file.type.startsWith(
                                        "image/"
                                    ) && (
                                            <img
                                                src={previewUrl}
                                                alt="Selected complaint evidence"
                                                className="max-h-80 w-full bg-slate-100 object-contain"
                                            />
                                        )}

                                    {file.type.startsWith(
                                        "video/"
                                    ) && (
                                            <video
                                                src={previewUrl}
                                                controls
                                                className="max-h-80 w-full bg-black"
                                            />
                                        )}

                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <FileImage
                                                size={20}
                                                className="shrink-0 text-blue-600"
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-700">
                                                    {file.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {(
                                                        file.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                removeFile
                                            }
                                            disabled={
                                                submitting
                                            }
                                            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                            aria-label="Remove file"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="
                                    image/jpeg,
                                    image/png,
                                    image/webp,
                                    video/mp4,
                                    video/webm,
                                    video/quicktime
                                "
                                onChange={
                                    handleFileChange
                                }
                                className="hidden"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(-1)
                                }
                                disabled={submitting}
                                className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    loadingDistricts
                                }
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />

                                        {uploading
                                            ? "Uploading..."
                                            : "Submitting..."}
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Submit Complaint
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmitComplaint;