import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";


// =========================================================
// PUBLIC
// =========================================================

import Home from "../Home";

import Login
    from "../components/pages/auth/Login";

import Register
    from "../components/pages/auth/Register";

import ForgotPassword
    from "../components/pages/auth/ForgotPassword";

import OtpLogin
    from "../components/pages/auth/OtpLogin";

import ResetPassword
    from "../components/pages/auth/ResetPassword";

import UpdatePassword
    from "../components/pages/auth/UpdatePassword";

import ChangePassword
    from "../components/pages/auth/ChangePassword";


// =========================================================
// USER API — ROLE-SPECIFIC PASSWORD CHANGE FUNCTIONS
// =========================================================

import {
    changeCitizenPassword,
    changeOfficerPassword,
    changeAdminPassword,
} from "../api/userApi";


// =========================================================
// CITIZEN
// =========================================================

import CitizenLayout
    from "../components/pages/citizen/CitizenLayout";

import CitizenDashboard
    from "../components/pages/citizen/CitizenDashboard";

import MyComplaints
    from "../components/pages/citizen/MyComplaints";

import SubmitComplaint
    from "../components/pages/citizen/SubmitComplaint";

import ComplaintDetails
    from "../components/pages/citizen/ComplaintDetails";

import ComplaintHistory
    from "../components/pages/citizen/ComplaintHistory";

import CitizenProfile
    from "../components/pages/citizen/CitizenProfile";


// =========================================================
// ADMIN
// =========================================================

import AdminLayout
    from "../components/pages/admin/AdminLayout";

import AdminDashboard
    from "../components/pages/admin/AdminDashboard";

import AdminAnalytics
    from "../components/pages/admin/AdminAnalytics";

import AdminComplaints
    from "../components/pages/admin/AdminComplaints";

import AdminIncidents
    from "../components/pages/admin/AdminIncidents";

import AdminComplaintDetails
    from "../components/pages/admin/AdminComplaintDetails";

import AdminIncidentDetails
    from "../components/pages/admin/AdminIncidentDetails";

import AdminOfficers
    from "../components/pages/admin/AdminOfficers";

import AdminOfficerDetails
    from "../components/pages/admin/AdminOfficerDetails";

import CreateOfficer
    from "../components/pages/admin/CreateOfficer";

import EditOfficer
    from "../components/pages/admin/EditOfficer";

import AdminDepartments
    from "../components/pages/admin/AdminDepartments";

import AdminDistricts
    from "../components/pages/admin/AdminDistricts";

import AdminProfile
    from "../components/pages/admin/AdminProfile";

import AdminEditProfile
    from "../components/pages/admin/AdminEditProfile";


// =========================================================
// OFFICER
// =========================================================

import OfficerLayout
    from "../components/pages/officer/OfficerLayout";

import OfficerDashboard
    from "../components/pages/officer/OfficerDashboard";

import OfficerIncidents
    from "../components/pages/officer/OfficerIncidents";

import OfficerIncidentDetails
    from "../components/pages/officer/OfficerIncidentDetails";

import OfficerIncidentHistory
    from "../components/pages/officer/OfficerIncidentHistory";

import OfficerComplaints
    from "../components/pages/officer/OfficerComplaints";

import OfficerComplaintDetails
    from "../components/pages/officer/OfficerComplaintDetails";

import OfficerComplaintHistory
    from "../components/pages/officer/OfficerComplaintHistory";

import OfficerProfile
    from "../components/pages/officer/OfficerProfile";


// =========================================================
// ROLE ROUTE
// =========================================================

import RoleRoute from "./RoleRoute";


// =========================================================
// APP ROUTES
// =========================================================

function AppRoutes() {

    return (

        <Routes>


            {/* PUBLIC HOME */}

            <Route
                path="/"
                element={
                    <Home />
                }
            />


            {/* AUTH */}

            <Route
                path="/login"
                element={
                    <Login />
                }
            />

            <Route
                path="/register"
                element={
                    <Register />
                }
            />

            <Route
                path="/forgot-password"
                element={
                    <ForgotPassword />
                }
            />

            <Route
                path="/otp-login"
                element={
                    <OtpLogin />
                }
            />

            <Route
                path="/reset-password"
                element={
                    <ResetPassword />
                }
            />

            <Route
                path="/update-password"
                element={
                    <UpdatePassword />
                }
            />


            {/* CITIZEN */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "CITIZEN",
                        ]}
                    />
                }
            >

                <Route
                    path="/citizen"
                    element={
                        <CitizenLayout />
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={
                            <CitizenDashboard />
                        }
                    />

                    <Route
                        path="complaints"
                        element={
                            <MyComplaints />
                        }
                    />

                    <Route
                        path="complaints/new"
                        element={
                            <SubmitComplaint />
                        }
                    />

                    <Route
                        path="complaints/:complaintId"
                        element={
                            <ComplaintDetails />
                        }
                    />

                    <Route
                        path="complaints/:complaintId/history"
                        element={
                            <ComplaintHistory />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <CitizenProfile />
                        }
                    />

                    {/* CITIZEN CHANGE PASSWORD */}

                    <Route
                        path="profile/change-password"
                        element={
                            <ChangePassword
                                backTo="/citizen/profile"
                                onChangePassword={changeCitizenPassword}
                            />
                        }
                    />

                </Route>

            </Route>


            {/* ADMIN */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "ADMIN",
                        ]}
                    />
                }
            >

                <Route
                    path="/admin"
                    element={
                        <AdminLayout />
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={
                            <AdminDashboard />
                        }
                    />

                    <Route
                        path="analytics"
                        element={
                            <AdminAnalytics />
                        }
                    />

                    <Route
                        path="complaints"
                        element={
                            <AdminComplaints />
                        }
                    />

                    <Route
                        path="complaints/:complaintId"
                        element={
                            <AdminComplaintDetails />
                        }
                    />

                    <Route
                        path="incidents"
                        element={
                            <AdminIncidents />
                        }
                    />

                    <Route
                        path="incidents/:incidentId"
                        element={
                            <AdminIncidentDetails />
                        }
                    />

                    <Route
                        path="officers"
                        element={
                            <AdminOfficers />
                        }
                    />

                    <Route
                        path="officers/create"
                        element={
                            <CreateOfficer />
                        }
                    />

                    <Route
                        path="/admin/officers/:officerId"
                        element={<AdminOfficerDetails />}
                    />

                    <Route
                        path="officers/:officerId/edit"
                        element={
                            <EditOfficer />
                        }
                    />

                    <Route
                        path="departments"
                        element={
                            <AdminDepartments />
                        }
                    />

                    <Route
                        path="districts"
                        element={
                            <AdminDistricts />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <AdminProfile />
                        }
                    />

                    <Route
                        path="profile/edit"
                        element={
                            <AdminEditProfile />
                        }
                    />

                    {/* ADMIN CHANGE PASSWORD */}

                    <Route
                        path="profile/change-password"
                        element={
                            <ChangePassword
                                backTo="/admin/profile"
                                onChangePassword={changeAdminPassword}
                            />
                        }
                    />

                </Route>

            </Route>


            {/* OFFICER */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "OFFICER",
                        ]}
                    />
                }
            >

                <Route
                    path="/officer"
                    element={
                        <OfficerLayout />
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={
                            <OfficerDashboard />
                        }
                    />

                    <Route
                        path="incidents"
                        element={
                            <OfficerIncidents />
                        }
                    />

                    <Route
                        path="incidents/:incidentId"
                        element={
                            <OfficerIncidentDetails />
                        }
                    />

                    <Route
                        path="incidents/:incidentId/history"
                        element={
                            <OfficerIncidentHistory />
                        }
                    />

                    <Route
                        path="complaints"
                        element={
                            <OfficerComplaints />
                        }
                    />

                    <Route
                        path="complaints/:complaintId"
                        element={
                            <OfficerComplaintDetails />
                        }
                    />

                    <Route
                        path="complaints/:complaintId/history"
                        element={
                            <OfficerComplaintHistory />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <OfficerProfile />
                        }
                    />

                    {/* OFFICER CHANGE PASSWORD */}

                    <Route
                        path="profile/change-password"
                        element={
                            <ChangePassword
                                backTo="/officer/profile"
                                onChangePassword={changeOfficerPassword}
                            />
                        }
                    />

                </Route>

            </Route>


            {/* FALLBACK */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );

}


export default AppRoutes;