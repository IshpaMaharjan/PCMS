import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0b5394",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1155cc",
  },
  text: {
    fontSize: 12,
    marginBottom: 2,
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  skill: {
    border: "1px solid #0b5394",
    borderRadius: 4,
    padding: 2,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 10,
  },
});

// Resume Template
const ResumeTemplate = ({ professional }) => {
  if (!professional) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>{professional.name}</Text>
          <Text style={styles.text}>{professional.professionalType}</Text>
          <Text style={styles.text}>{professional.email}</Text>
          {professional.phone && <Text style={styles.text}>{professional.phone}</Text>}
          {professional.address && <Text style={styles.text}>{professional.address}</Text>}
        </View>

        {/* Professional Summary */}
        {professional.bio && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>About Me</Text>
            <Text style={styles.text}>{professional.bio}</Text>
          </View>
        )}

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Professional Details</Text>
          {professional.experience > 0 && (
            <Text style={styles.text}>Experience: {professional.experience} years</Text>
          )}
          {professional.qualification && (
            <Text style={styles.text}>Qualification: {professional.qualification}</Text>
          )}
          {professional.expertise && (
            <Text style={styles.text}>Expertise Level: {professional.expertise}</Text>
          )}
          {professional.hourlyRate > 0 && (
            <Text style={styles.text}>Hourly Rate: ${professional.hourlyRate}/hr</Text>
          )}
        </View>

        {/* Skills */}
        {professional.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Skills</Text>
            <View style={styles.skillsContainer}>
              {professional.skills.map((skill, idx) => (
                <Text key={idx} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate;