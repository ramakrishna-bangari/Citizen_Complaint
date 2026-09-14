function HomeFooter() {

    return (
        <footer
            id="about"
            className="border-t border-slate-200 bg-white"
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    px-3
                    py-10
                    sm:px-4
                    lg:px-6
                    xl:px-8
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-600
                            font-bold
                            text-white
                        "
                    >
                        C
                    </div>


                    <div>

                        <p className="font-semibold text-slate-900">
                            Citizen Complaint Management System
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            A platform for submitting citizen complaints,
                            following their progress, and viewing complaint history.
                        </p>

                    </div>

                </div>

            </div>

        </footer>
    );
}


export default HomeFooter;