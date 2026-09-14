function ComplaintWorkflow() {

    const steps = [
        {
            number: "01",
            title: "Submit your complaint",
            description:
                "Enter the details of the problem and submit your complaint online.",
        },

        {
            number: "02",
            title: "Complaint is reviewed",
            description:
                "The complaint is checked and sent to the appropriate department or officer.",
        },

        {
            number: "03",
            title: "Officer works on it",
            description:
                "The assigned officer reviews the issue and updates the complaint as work progresses.",
        },

        {
            number: "04",
            title: "Track the result",
            description:
                "Check the latest status and view the history of your complaint from your account.",
        },
    ];


    return (
        <section
            id="how-it-works"
            className="bg-slate-50 py-20 sm:py-24"
        >

            <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6 xl:px-8">

                {/* Header */}

                <div className="max-w-2xl">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        How It Works
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        What happens after you report a problem?
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Your complaint moves through a simple process so you
                        can see what is happening at each stage.
                    </p>

                </div>

                <div className="relative mt-14 grid gap-8 md:grid-cols-4">

                   
                    <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200 md:hidden" />

                    {steps.map((step, index) => (

                        <div key={step.number} className="relative">

                            {/* DESKTOP  */}

                            {index < steps.length - 1 && (

                                <div className=" absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-slate-200 md:block" />

                            )}

                            
                            <div className="flex items-start gap-4 md:block">

                                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    {step.number}
                                </div>

                                <div className="pt-2 md:mt-5 md:pt-0">

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                                        {step.description}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}
                </div>


                <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                    <h3 className="font-semibold text-slate-900">
                        Keep track of your complaint
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        After submitting a complaint, sign in to your account to check its current status, view previous updates,and follow the complaint until it is resolved.
                    </p>

                </div>

            </div>

        </section>
    );
}


export default ComplaintWorkflow;