import {
    Construction,
    Droplet,
    HelpCircle,
    Landmark,
    Lightbulb,
    Trash2,
} from "lucide-react";


function PlatformOverview() {

    const services = [
        {
            title: "Roads & Streets",
            icon: Construction,
            description:
                "Report potholes, damaged roads, blocked streets, and other road-related problems.",
            examples: [
                "Potholes",
                "Damaged roads",
                "Blocked streets",
            ],
        },

        {
            title: "Street Lighting",
            icon: Lightbulb,
            description:
                "Report street lights that are not working or public areas that need better lighting.",
            examples: [
                "Light not working",
                "Damaged light",
                "Dark public areas",
            ],
        },

        {
            title: "Waste & Cleanliness",
            icon: Trash2,
            description:
                "Report problems with garbage collection and cleanliness in public places.",
            examples: [
                "Garbage not collected",
                "Overflowing bins",
                "Unclean areas",
            ],
        },

        {
            title: "Water Services",
            icon: Droplet,
            description:
                "Report common problems related to public water supply and facilities.",
            examples: [
                "Water leakage",
                "Supply problems",
                "Damaged public taps",
            ],
        },

        {
            title: "Public Facilities",
            icon: Landmark,
            description:
                "Report damage to public facilities and other property maintained for public use.",
            examples: [
                "Damaged benches",
                "Broken facilities",
                "Property damage",
            ],
        },

        {
            title: "Other Issues",
            icon: HelpCircle,
            description:
                "Submit a complaint if your issue does not fit into one of the listed categories.",
            examples: [
                "Local problems",
                "General complaints",
                "Other civic issues",
            ],
        },
    ];


    return (
        <section
            id="services"
            className="bg-white py-20 sm:py-24"
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    px-3
                    sm:px-4
                    lg:px-6
                    xl:px-8
                "
            >

                {/* Header */}

                <div className="max-w-2xl">

                    <p
                        className="
                            text-sm
                            font-semibold
                            uppercase
                            tracking-wider
                            text-blue-600
                        "
                    >
                        What You Can Report
                    </p>


                    <h2
                        className="
                            mt-3
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-4xl
                        "
                    >
                        Report problems in your area
                    </h2>


                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Choose the type of problem you are facing and submit
                        the details through your account.
                    </p>

                </div>


                {/* Service Cards */}

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {services.map((service) => {

                        const Icon = service.icon;

                        return (

                            <article
                                key={service.title}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:border-blue-200
                                    hover:shadow-md
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                    "
                                >
                                    <Icon size={22} />
                                </div>


                                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                    {service.title}
                                </h3>


                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {service.description}
                                </p>


                                <div className="mt-5 space-y-2">

                                    {service.examples.map((example) => (

                                        <div
                                            key={example}
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-slate-500
                                            "
                                        >

                                            <span className="text-blue-600">
                                                •
                                            </span>

                                            <span>
                                                {example}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </article>

                        );

                    })}

                </div>

            </div>

        </section>
    );
}


export default PlatformOverview;