import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Users,
  Calendar,
  XCircle,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  Printer,
  CalendarX,
  Sparkles,
  Lock,
  Unlock,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { BookingRecord } from "../../types/booking";
import { getSavedBookings } from "../../services/bookingEngine";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const { isUrdu } = useLanguage();
  const { currentUser, isAdmin, allUsers, blockedDates, changeUserRole, toggleBlockDate, cancelAppointment, refreshData, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"bookings_report" | "users_report" | "date_controls">("bookings_report");

  // Bookings state
  const [bookingsList, setBookingsList] = useState<BookingRecord[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("all");
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>("");

  // Block date form state
  const [targetBlockDate, setTargetBlockDate] = useState<string>("");
  const [blockReasonEn, setBlockReasonEn] = useState<string>("Clinic closed by administration");
  const [blockReasonUr, setBlockReasonUr] = useState<string>("کلینک انتظامیہ کی طرف سے بند کیا گیا ہے");

  // Action alerts & confirmation modals state
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<{ id: string; refCode: string; patientName: string; date: string } | null>(null);
  const [roleToChange, setRoleToChange] = useState<{ userId: string; userName: string; currentRole: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadBookings = () => {
    setBookingsList(getSavedBookings());
  };

  useEffect(() => {
    if (isOpen) {
      loadBookings();
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
          <div className="relative bg-white p-8 rounded-3xl max-w-md w-full text-center space-y-4 z-10">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-clinical-900">
              {isUrdu ? "ایڈمن رسائی کی اجازت نہیں ہے" : "Admin Access Required"}
            </h3>
            <p className="text-xs text-clinical-600">
              {isUrdu
                ? "اس پورٹل کے لیے ایڈمن کا لاگ ان ہونا ضروری ہے۔"
                : "You must be signed in as an Admin to view these database reports."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-clinical-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              {isUrdu ? "بند کریں" : "Close"}
            </button>
          </div>
        </div>
      </AnimatePresence>
    );
  }

  // Filtered Bookings
  const filteredBookings = bookingsList.filter((b) => {
    const matchesStatus =
      bookingFilterStatus === "all" ||
      (bookingFilterStatus === "cancelled" && b.status === "cancelled") ||
      (bookingFilterStatus === "confirmed" && b.status === "confirmed") ||
      (bookingFilterStatus === "pending" && b.status === "pending_payment");

    const query = bookingSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.patient.fullName.toLowerCase().includes(query) ||
      b.patient.phone.includes(query) ||
      b.referenceCode.toLowerCase().includes(query) ||
      b.selectedDate.includes(query);

    return matchesStatus && matchesSearch;
  });

  // Handle Cancel Appointment Execution
  const executeCancelBooking = (bookingId: string) => {
    const res = cancelAppointment(bookingId);
    if (res.success) {
      setActionNotice({ type: "success", message: isUrdu ? res.messageUr : res.messageEn });
      loadBookings();
    } else {
      setActionNotice({ type: "error", message: isUrdu ? res.messageUr : res.messageEn });
    }
  };

  // Handle Block / Unblock Date
  const handleToggleBlockDate = (dateStr: string) => {
    setActionNotice(null);
    const res = toggleBlockDate(dateStr, blockReasonEn, blockReasonUr);
    if (res.success) {
      setActionNotice({ type: "success", message: isUrdu ? res.messageUr : res.messageEn });
      setTargetBlockDate("");
      loadBookings();
    } else {
      setActionNotice({
        type: "error",
        message: isUrdu ? res.messageUr : res.messageEn,
      });
    }
  };

  // Handle Role Change Execution
  const executeRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    const res = changeUserRole(userId, newRole);
    if (res.success) {
      setActionNotice({ type: "success", message: isUrdu ? res.messageUr : res.messageEn });
    } else {
      setActionNotice({ type: "error", message: isUrdu ? res.messageUr : res.messageEn });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setActionNotice(null);
    loadBookings();
    refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      setActionNotice({
        type: "success",
        message: isUrdu
          ? "ڈیٹا بیس کی معلومات کامیابی سے ریفریش ہو گئی ہیں۔ تمام تازہ ترین بکنگز، صارف اور بلاک شدہ تاریخیں لوڈ ہو گئی ہیں۔"
          : "Database successfully refreshed! Latest appointments, users, and date records loaded.",
      });
    }, 450);
  };

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const printDate = new Date().toLocaleString();
    let reportTitle = "Clinic Database Report";
    let contentHtml = "";

    if (activeTab === "bookings_report") {
      reportTitle = "Appointments & Patient Bookings Report";
      const totalFees = filteredBookings.reduce((sum, b) => sum + (b.totalFeePkr || 0), 0);
      contentHtml = `
        <div style="margin-bottom: 16px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #334155;">
          <strong>Filter Status:</strong> ${bookingFilterStatus.toUpperCase()} &nbsp;|&nbsp;
          <strong>Total Records:</strong> ${filteredBookings.length} &nbsp;|&nbsp;
          <strong>Total Fees:</strong> PKR ${totalFees.toLocaleString()}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #142127; color: white;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">#</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Ref Code</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Patient Name</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Contact</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Mode & City</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Date & Time</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">Fee (PKR)</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${
              filteredBookings.length === 0
                ? `<tr><td colspan="8" style="padding: 20px; text-align: center; color: #64748b;">No appointment records found.</td></tr>`
                : filteredBookings
                    .map(
                      (b, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${idx + 1}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: bold; font-family: monospace;">${b.referenceCode}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${b.patient?.fullName || "N/A"}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${b.patient?.phone || "N/A"}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${b.mode === "in_person" ? "In-Person Clinic" : "Online Video"} (${b.location?.city || "Online"})</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${b.selectedDate} ${b.selectedSlot?.label || ""}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${(b.totalFeePkr || 0).toLocaleString()}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: ${
                  b.status === "confirmed" ? "#16a34a" : b.status === "cancelled" ? "#dc2626" : "#d97706"
                };">${b.status.replace("_", " ").toUpperCase()}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      `;
    } else if (activeTab === "users_report") {
      reportTitle = "Registered Users & Accounts Report";
      contentHtml = `
        <div style="margin-bottom: 16px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #334155;">
          <strong>Total Registered Accounts:</strong> ${allUsers.length}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #142127; color: white;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">#</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Full Name</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Email Address</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Phone</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">Role</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Registered On</th>
            </tr>
          </thead>
          <tbody>
            ${allUsers
              .map(
                (u, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${idx + 1}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: bold;">${u.name}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${u.email}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${u.phone || "N/A"}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: ${
                  u.role === "admin" ? "#7c3aed" : "#334155"
                };">${u.role.toUpperCase()}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else {
      reportTitle = "Manage Blocked Dates Report";
      contentHtml = `
        <div style="margin-bottom: 16px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #334155;">
          <strong>Total Blocked Dates:</strong> ${blockedDates.length}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #142127; color: white;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">#</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Blocked Date</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Reason (English)</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Reason (Urdu)</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Blocked By</th>
            </tr>
          </thead>
          <tbody>
            ${
              blockedDates.length === 0
                ? `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #64748b;">No blocked dates currently.</td></tr>`
                : blockedDates
                    .map(
                      (bd, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${idx + 1}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #dc2626;">${bd.dateStr}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${bd.reasonEn || "N/A"}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${bd.reasonUr || "N/A"}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${bd.blockedBy || "Admin"}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dr. Fahad Clinic - ${reportTitle}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #0f172a; background: #ffffff; }
            .header-box { text-align: center; border-bottom: 2px solid #142127; padding-bottom: 16px; margin-bottom: 20px; }
            .header-box h1 { margin: 0; font-size: 24px; color: #142127; font-family: Georgia, serif; }
            .header-box p { margin: 6px 0 0; font-size: 13px; color: #475569; font-weight: 500; }
            .report-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 20px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; }
            .footer-box { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.2cm; size: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1>Dr. Fahad Ul Zain - Consultant Psychiatrist</h1>
            <p>Neuropsychiatry & Behavioral Health Clinic | Nawabshah, Hyderabad, Karachi</p>
          </div>
          <div class="report-meta">
            <div><strong>Document Type:</strong> ${reportTitle}</div>
            <div><strong>Printed On:</strong> ${printDate}</div>
          </div>
          ${contentHtml}
          <div class="footer-box">
            <div>Official Medical Records Report &bull; Dr. Fahad Clinic Database</div>
            <div>Page 1 of 1</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-clinical-950/70 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className={`relative bg-white rounded-3xl shadow-2xl border border-clinical-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden z-10 ${
            isUrdu ? "text-right" : "text-left"
          }`}
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Admin Header */}
          <div className="bg-clinical-900 text-white p-4 sm:p-5 shrink-0 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-clinical-800">
            <div className={`flex items-center gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <div>
                <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                    {isUrdu ? "ڈاکٹر فہد کلینک - ایڈمن پورٹل ڈیش بورڈ" : "Dr. Fahad Clinic - Admin Portal & Database"}
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30 uppercase font-bold">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-clinical-200 mt-0.5">
                  {isUrdu
                    ? `لاگ ان شدہ ایڈمن: ${currentUser?.name} (${currentUser?.email})`
                    : `Active Admin: ${currentUser?.name} (${currentUser?.email})`}
                </p>
              </div>
            </div>

            <div className={`w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
              {/* 1st Button: Refresh Database */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-1 sm:flex-initial justify-center px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm border border-emerald-400/30 disabled:opacity-75 whitespace-nowrap"
                title={isUrdu ? "ڈیٹا بیس ریفریش کریں" : "Refresh Database"}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="inline">{isRefreshing ? (isUrdu ? "ریفریش..." : "Refreshing...") : (isUrdu ? "ریفریش" : "Refresh")}</span>
              </button>

              {/* 2nd Button: Print Report */}
              <button
                onClick={handlePrintReport}
                className="flex-1 sm:flex-initial justify-center px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm border border-indigo-400/30 whitespace-nowrap"
                title={isUrdu ? "رپورٹ پرنٹ / پی ڈی ایف محفوظ کریں" : "Print PDF Report"}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="inline">{isUrdu ? "پرنٹ (PDF)" : "Print PDF"}</span>
              </button>

              {/* 3rd Button: Close Window */}
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial justify-center px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm border border-red-400/30 whitespace-nowrap"
                title={isUrdu ? "ونڈو بند کریں" : "Close Window"}
              >
                <X className="w-3.5 h-3.5" />
                <span className="inline">{isUrdu ? "بند کریں" : "Close"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <div className="bg-clinical-50/80 border-b border-clinical-150 px-3 sm:px-6 py-2.5 overflow-x-auto scrollbar-thin touch-pan-x shrink-0 w-full max-w-full">
            <div className={`flex items-center gap-2 min-w-max ${isUrdu ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setActiveTab("bookings_report")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  activeTab === "bookings_report"
                    ? "bg-clinical-800 text-white shadow-sm ring-1 ring-clinical-700"
                    : "bg-white text-clinical-700 hover:bg-clinical-100 border border-clinical-200/80"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>{isUrdu ? "رپورٹ 1: تمام اپوائنٹمنٹس" : "Report 1: All Appointments"}</span>
                <span className="ml-1 bg-clinical-200/60 text-clinical-900 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {bookingsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("users_report")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  activeTab === "users_report"
                    ? "bg-clinical-800 text-white shadow-sm ring-1 ring-clinical-700"
                    : "bg-white text-clinical-700 hover:bg-clinical-100 border border-clinical-200/80"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>{isUrdu ? "رپورٹ 2: رجسٹرڈ صارفین" : "Report 2: Registered Users"}</span>
                <span className="ml-1 bg-clinical-200/60 text-clinical-900 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {allUsers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("date_controls")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  activeTab === "date_controls"
                    ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-500"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300"
                }`}
              >
                <CalendarX className={`w-4 h-4 shrink-0 ${activeTab === "date_controls" ? "text-white" : "text-amber-600"}`} />
                <span>{isUrdu ? "تاریخوں کی بندش / کنٹرول (Rule 3)" : "Manage Blocked Dates"}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === "date_controls" ? "bg-white/25 text-white" : "bg-amber-200/80 text-amber-950"
                }`}>
                  {blockedDates.length}
                </span>
              </button>
            </div>
          </div>

          {/* Alert / Notice Display */}
          {actionNotice && (
            <div
              className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
                actionNotice.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionNotice.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{actionNotice.message}</span>
              </div>
              <button
                onClick={() => setActionNotice(null)}
                className="text-xs text-clinical-400 hover:text-clinical-800 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* REPORT 1: BOOKING DETAILS */}
            {activeTab === "bookings_report" && (
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-clinical-50 p-3 rounded-2xl border border-clinical-150">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      placeholder={isUrdu ? "نام، فون یا ریفرنس کوڈ سے تلاش کریں..." : "Search by name, phone, ref code..."}
                      value={bookingSearchQuery}
                      onChange={(e) => setBookingSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-clinical-200 focus:ring-2 focus:ring-clinical-500 outline-none bg-white"
                    />
                    <Search className="w-4 h-4 text-clinical-400 absolute left-3 top-2.5" />
                  </div>

                  <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <Filter className="w-4 h-4 text-clinical-500" />
                    <span className="text-xs font-semibold text-clinical-600">{isUrdu ? "اسٹیٹس:" : "Status:"}</span>
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="text-xs py-2 px-3 rounded-xl border border-clinical-200 bg-white font-medium text-clinical-800 outline-none"
                    >
                      <option value="all">{isUrdu ? "تمام اپوائنٹمنٹس" : "All Bookings"}</option>
                      <option value="confirmed">{isUrdu ? "کنفرم (Confirmed)" : "Confirmed"}</option>
                      <option value="pending">{isUrdu ? "پینڈنگ پیمنٹ" : "Pending Payment"}</option>
                      <option value="cancelled">{isUrdu ? "منسوخ شدہ (Cancelled)" : "Cancelled"}</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="border border-clinical-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-clinical-100 text-clinical-800 font-bold uppercase tracking-wider border-b border-clinical-200">
                        <tr>
                          <th className="p-3">Ref Code</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Mode / Location</th>
                          <th className="p-3">Booking Date & Slot</th>
                          <th className="p-3">Payment Fee</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-clinical-150 font-medium">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-clinical-500">
                              {isUrdu ? "کوئی اپوائنٹمنٹ آن لائن ڈیٹا بیس میں موجود نہیں ہے۔" : "No booking records found in database."}
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((item) => (
                            <tr key={item.id} className="hover:bg-clinical-50/60 transition-colors">
                              <td className="p-3 font-mono font-bold text-clinical-900">{item.referenceCode}</td>
                              <td className="p-3">
                                <div className="font-semibold text-clinical-900">{item.patient.fullName}</div>
                                <div className="text-[10px] text-clinical-500">{item.patient.reason || "General OPD"}</div>
                              </td>
                              <td className="p-3 font-mono">
                                <div>{item.patient.phone}</div>
                                <div className="text-[10px] text-clinical-400">{item.patient.email}</div>
                              </td>
                              <td className="p-3 capitalize">
                                <span className="inline-block px-2 py-0.5 rounded bg-clinical-100 text-clinical-800 text-[10px] font-bold">
                                  {item.mode}
                                </span>
                                <div className="text-[10px] text-clinical-500 mt-0.5">{item.location}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-clinical-800">{item.selectedDate}</div>
                                <div className="text-[10px] text-emerald-700 font-mono">{item.selectedSlot?.label}</div>
                              </td>
                              <td className="p-3 font-mono">
                                {item.country?.currency} {item.country?.fee}
                                <div className="text-[10px] text-clinical-400 capitalize">{item.paymentMethod}</div>
                              </td>
                              <td className="p-3">
                                {item.status === "cancelled" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                    <XCircle className="w-3 h-3" /> Cancelled
                                  </span>
                                ) : item.isPaid || item.status === "confirmed" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Pending Payment
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {item.status !== "cancelled" ? (
                                  <button
                                    onClick={() =>
                                      setBookingToCancel({
                                        id: item.id,
                                        refCode: item.referenceCode,
                                        patientName: item.patient.fullName,
                                        date: item.selectedDate,
                                      })
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                    title="Cancel this appointment"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{isUrdu ? "منسوخ کریں" : "Cancel"}</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-clinical-400 italic">No action</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* REPORT 2: REGISTERED USERS & ROLES */}
            {activeTab === "users_report" && (
              <div className="space-y-4">
                <div className="bg-clinical-50 p-4 rounded-2xl border border-clinical-150 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-clinical-900">
                      {isUrdu ? "رجسٹرڈ صارفین کی رپورٹ اور نقشہ کنٹرول" : "Registered Users & Role Management"}
                    </h4>
                    <p className="text-xs text-clinical-600 mt-0.5">
                      {isUrdu
                        ? "نئے سائن اپ کرنے والے تمام صارفین بالتحویل 'کلائنٹ' ہوتے ہیں۔ صرف ایڈمن کو ان کا رول تبدیل کرنے کا حق حاصل ہے۔"
                        : "Rule 5 & 6: All new signups are Client by default. Only Admin can assign or promote users to Admin role."}
                    </p>
                  </div>
                </div>

                <div className="border border-clinical-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-clinical-100 text-clinical-800 font-bold uppercase tracking-wider border-b border-clinical-200">
                        <tr>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Full Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Assigned Role</th>
                          <th className="p-3">Registered At</th>
                          <th className="p-3">Last Login</th>
                          <th className="p-3 text-center">Change Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-clinical-150 font-medium">
                        {allUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-clinical-50/60 transition-colors">
                            <td className="p-3 font-mono text-clinical-500 text-[10px]">{user.id}</td>
                            <td className="p-3 font-bold text-clinical-900">{user.name}</td>
                            <td className="p-3 font-mono">{user.email}</td>
                            <td className="p-3 font-mono text-clinical-600">{user.phone || "—"}</td>
                            <td className="p-3">
                              {user.role === "admin" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                  <ShieldAlert className="w-3 h-3 text-purple-700" /> ADMIN
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  <UserCheck className="w-3 h-3 text-blue-600" /> CLIENT
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-clinical-500 font-mono text-[10px]">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-clinical-500 font-mono text-[10px]">
                              {new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3 text-center">
                              {user.id === currentUser?.id ? (
                                <span className="text-[10px] text-clinical-400 italic">Current Session</span>
                              ) : (
                                <button
                                  onClick={() => setRoleToChange({ userId: user.id, userName: user.name, currentRole: user.role })}
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                    user.role === "admin"
                                      ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                                      : "bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300"
                                  }`}
                                >
                                  <span>
                                    {user.role === "admin"
                                      ? isUrdu
                                        ? "کلائنٹ بنائیں"
                                        : "Revoke Admin (Set Client)"
                                      : isUrdu
                                      ? "ایڈمن بنائیں"
                                      : "Promote to Admin"}
                                  </span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DATE CONTROLS & BLOCKING (RULE 3) */}
            {activeTab === "date_controls" && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{isUrdu ? "تاریخ بلاک کرنے کے قواعد (Rule 3 Rules & Validation)" : "Calendar Date Restriction Rules (Rule 3)"}</span>
                  </div>
                  <p>
                    1. <strong>24 Hours Notice Requirement:</strong> Dates can only be disallowed / blocked at least 24 hours prior to current time.
                  </p>
                  <p>
                    2. <strong>Active Appointments Check:</strong> If any active (non-cancelled) appointment exists on the target date, the system will prevent blocking and display a notice requiring you to cancel all active appointments for that date first.
                  </p>
                </div>

                {/* Form to Block Date */}
                <div className="bg-clinical-50 p-5 rounded-2xl border border-clinical-200 space-y-4">
                  <h4 className="font-bold text-sm text-clinical-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-clinical-700" />
                    <span>{isUrdu ? "کسی تاریخ پر تمام آن لائن بکنگز بلاک کریں" : "Disallow / Block Specific Date for Booking"}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-clinical-700 mb-1">
                        {isUrdu ? "تاریخ منتخب کریں (YYYY-MM-DD)" : "Select Date to Block"}
                      </label>
                      <input
                        type="date"
                        value={targetBlockDate}
                        onChange={(e) => setTargetBlockDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-clinical-300 text-xs bg-white font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-clinical-700 mb-1">
                        {isUrdu ? "بلاک کرنے کی وجہ (English)" : "Reason (English)"}
                      </label>
                      <input
                        type="text"
                        value={blockReasonEn}
                        onChange={(e) => setBlockReasonEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-clinical-300 text-xs bg-white outline-none"
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (!targetBlockDate) {
                            alert("Please select a valid date first.");
                            return;
                          }
                          handleToggleBlockDate(targetBlockDate);
                        }}
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Ban className="w-4 h-4" />
                        <span>{isUrdu ? "یہ تاریخ بلاک کریں" : "Apply Date Restriction"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Blocked Dates */}
                <div>
                  <h4 className="font-bold text-sm text-clinical-900 mb-3 flex items-center gap-2">
                    <CalendarX className="w-4 h-4 text-red-600" />
                    <span>{isUrdu ? "موجودہ بلاک شدہ تاریخیں (Blocked Dates Records)" : "Currently Blocked Dates List"}</span>
                  </h4>

                  <div className="border border-clinical-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-clinical-100 text-clinical-800 font-bold uppercase tracking-wider border-b border-clinical-200">
                        <tr>
                          <th className="p-3">Blocked Date</th>
                          <th className="p-3">Reason (EN)</th>
                          <th className="p-3">Reason (UR)</th>
                          <th className="p-3">Blocked By</th>
                          <th className="p-3 text-center">Unblock Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-clinical-150 font-medium">
                        {blockedDates.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-clinical-500">
                              {isUrdu ? "کوئی تاریخ بلاک نہیں کی گئی ہے۔" : "No dates are currently blocked."}
                            </td>
                          </tr>
                        ) : (
                          blockedDates.map((item) => (
                            <tr key={item.dateStr} className="hover:bg-clinical-50/60 transition-colors">
                              <td className="p-3 font-mono font-bold text-red-700">{item.dateStr}</td>
                              <td className="p-3 text-clinical-800">{item.reasonEn}</td>
                              <td className="p-3 text-clinical-800 font-sans">{item.reasonUr}</td>
                              <td className="p-3 text-clinical-500 font-mono text-[10px]">{item.blockedBy}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleToggleBlockDate(item.dateStr)}
                                  className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isUrdu ? "کھولیں (Unblock)" : "Allow Date"}</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full-Width Bottom Bar with Log Out Button */}
          <div className="bg-clinical-950 border-t border-clinical-800 p-3 sm:p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-white w-full">
            <div className="flex items-center gap-2 text-xs text-clinical-200">
              <span className="font-semibold text-amber-300">
                {isUrdu ? `لاگ ان شدہ ایڈمن: ${currentUser?.name}` : `Active Admin: ${currentUser?.name}`}
              </span>
              <span className="text-clinical-400 font-mono text-[11px]">({currentUser?.email})</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer border border-red-500/50"
                id="btn-admin-modal-logout"
              >
                <LogOut className="w-4 h-4" />
                <span>{isUrdu ? "ایڈمن پورٹل سے لاگ آؤٹ کریں" : "Log Out from Admin Portal"}</span>
              </button>
            </div>
          </div>

          {/* CONFIRMATION MODAL: CANCEL APPOINTMENT */}
          <AnimatePresence>
            {bookingToCancel && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-clinical-150 space-y-4 text-clinical-900"
                >
                  <div className="flex items-center gap-3 text-red-600">
                    <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-clinical-950">
                        {isUrdu ? "اپوائنٹمنٹ منسوخی کی تصدیق" : "Confirm Cancel Appointment"}
                      </h3>
                      <p className="text-xs text-clinical-500 font-mono">Ref Code: {bookingToCancel.refCode}</p>
                    </div>
                  </div>

                  <div className="bg-red-50/80 border border-red-150 rounded-2xl p-4 text-xs text-clinical-800 space-y-2 leading-relaxed">
                    {isUrdu ? (
                      <p>
                        کیا آپ واقعی مریض <strong className="text-red-700 font-bold">{bookingToCancel.patientName}</strong> کی تاریخ <strong className="text-red-700 font-bold">{bookingToCancel.date}</strong> کی اپوائنٹمنٹ منسوخ اور ختم کرنا چاہتے ہیں؟
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to cancel and remove appointment for <strong className="text-red-700 font-bold">{bookingToCancel.patientName}</strong> on <strong className="text-red-700 font-bold">{bookingToCancel.date}</strong>?
                      </p>
                    )}
                    <p className="text-[11px] text-red-600 font-medium">
                      {isUrdu ? "یہ عمل اس ٹائم سلاٹ کو بھی فوری طور پر آزاد کر دے گا۔" : "This will immediately free up the booked slot for other patients."}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setBookingToCancel(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-clinical-100 text-clinical-700 hover:bg-clinical-200 transition-colors cursor-pointer"
                    >
                      {isUrdu ? "نہیں، منسوخ نہ کریں" : "No, Keep It"}
                    </button>
                    <button
                      onClick={() => {
                        executeCancelBooking(bookingToCancel.id);
                        setBookingToCancel(null);
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
                    >
                      {isUrdu ? "ہاں، منسوخ اور ختم کریں" : "Yes, Cancel & Remove"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* CONFIRMATION MODAL: ROLE CHANGE */}
          <AnimatePresence>
            {roleToChange && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-clinical-150 space-y-4 text-clinical-900"
                >
                  <div className="flex items-center gap-3 text-purple-600">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-clinical-950">
                        {isUrdu ? "صارف کا رول تبدیل کریں" : "Confirm Role Change"}
                      </h3>
                      <p className="text-xs text-clinical-500 font-mono">{roleToChange.userName}</p>
                    </div>
                  </div>

                  <div className="bg-purple-50/80 border border-purple-150 rounded-2xl p-4 text-xs text-clinical-800 leading-relaxed">
                    {isUrdu ? (
                      <p>
                        کیا آپ <strong className="text-purple-900 font-bold">{roleToChange.userName}</strong> کا رول <strong className="text-purple-900 font-bold">{roleToChange.currentRole === "admin" ? "کلائنٹ" : "ایڈمن"}</strong> میں تبدیل کرنا چاہتے ہیں؟
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to change role for <strong className="text-purple-900 font-bold">{roleToChange.userName}</strong> to <strong className="text-purple-900 font-bold">{roleToChange.currentRole === "admin" ? "CLIENT" : "ADMIN"}</strong>?
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setRoleToChange(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-clinical-100 text-clinical-700 hover:bg-clinical-200 transition-colors cursor-pointer"
                    >
                      {isUrdu ? "منسوخ کریں" : "Cancel"}
                    </button>
                    <button
                      onClick={() => {
                        executeRoleChange(roleToChange.userId, roleToChange.currentRole);
                        setRoleToChange(null);
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-sm"
                    >
                      {isUrdu ? "ہاں، تبدیل کریں" : "Yes, Confirm"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
