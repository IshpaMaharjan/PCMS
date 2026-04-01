import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import { Loader } from "lucide-react";
import axios from "axios";

// ---------------- PDF Styles ----------------
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    fontSize: 12,
    lineHeight: 1.8, 
    color: "#333",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    color: "#1E40AF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sidebar: {
    width: "45%",
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    backgroundColor: "#F9FAFB", 
    borderRadius: 8,
    paddingVertical: 10,
  },
  main: {
    width: "60%",
    paddingLeft: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1E3A8A",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
  },
  item: {
    marginBottom: 10,
    fontSize: 12,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  skill: {
    backgroundColor: "#E0E7FF",
    color: "#1E40AF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 4,
    fontSize: 11,
  },
  footer: {
    textAlign: "center",
    marginTop: 60, 
    fontSize: 10,
    color: "#666",
  },
});

// ---------------- PDF Document ----------------
const MyResumePDF = ({ professional }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{professional.name || "Your Name"}</Text>

      <View style={styles.container}>
        {/* Sidebar - Personal Details */}
        <View style={styles.sidebar}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            {professional.email && <Text style={styles.item}>Email: {professional.email}</Text>}
            {professional.phone && <Text style={styles.item}>Phone: {professional.phone}</Text>}
            {professional.address && <Text style={styles.item}>Address: {professional.address}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            {professional.professionalType && <Text style={styles.item}>Role: {professional.professionalType}</Text>}
            {professional.hourlyRate && <Text style={styles.item}>Rate: ${professional.hourlyRate}/hr</Text>}
          </View>
        </View>

        {/* Main - Professional Details */}
        <View style={styles.main}>
          {professional.experience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <Text style={styles.item}>{professional.experience} years</Text>
            </View>
          )}

          {professional.qualification && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Qualification</Text>
              <Text style={styles.item}>{professional.qualification}</Text>
            </View>
          )}

          {professional.skills && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsRow}>
                {professional.skills.map((skill, index) => (
                  <Text key={index} style={styles.skill}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {professional.expertise && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expertise</Text>
              <View style={styles.skillsRow}>
                {professional.expertise.split(",").map((skill, index) => (
                  <Text key={index} style={styles.skill}>{skill.trim()}</Text>
                ))}
              </View>
            </View>
          )}

          {professional.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.item}>{professional.bio}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.footer}>Generated with PCMS System</Text>
    </Page>
  </Document>
);

// ---------------- GenerateResume Component ----------------
const GenerateResume = () => {
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const id = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfessional(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile for resume.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin w-12 h-12 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!professional) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Resume Preview</h1>

      {/* PDF Viewer */}
      <div className="w-full max-w-4xl h-[80vh] border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg mb-6">
        <PDFViewer width="100%" height="100%">
          <MyResumePDF professional={professional} />
        </PDFViewer>
      </div>

      {/* Download Button */}
      <PDFDownloadLink
        document={<MyResumePDF professional={professional} />}
        fileName={`${professional.name || "resume"}.pdf`}
      >
        {({ loading }) => (
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Preparing PDF..." : "Download Resume PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default GenerateResume;