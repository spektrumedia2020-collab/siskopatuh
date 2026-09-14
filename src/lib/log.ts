import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const recordAdminLog = async (actionDesc: string) => {
  try {
    const adminName = localStorage.getItem("admin_auth_name") || "Admin Sistem";
    await addDoc(collection(db, "admin_logs"), {
      adminName: adminName,
      action: actionDesc,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error logging action", e);
  }
};
