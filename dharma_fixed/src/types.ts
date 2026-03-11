export type Language = "EN" | "HI" | "TA";

export interface Case {
  id: string;
  type: string;
  date: string;
  evidenceCount: number;
  status: "Downloaded" | "Generated" | "Draft";
  description?: string;
  /* new property holding transcribed text from the audio recording */
  transcript?: string;
  evidenceFiles?: EvidenceFile[];
  incidentType?: string;
  filedAgainst?: string;
  submitTo?: string;
}

export interface EvidenceFile {
  id: string;
  file: File;
  timestamp: string;
  description: string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    home: "Home",
    record: "Record",
    evidence: "Evidence",
    complaint: "Complaint",
    myCases: "My Cases",
    heroTitle: "Your Voice. Your Rights. Your Justice.",
    startRecording: "Start Recording",
    recentCases: "Recent Cases",
    step1: "Record Your Testimony",
    step2: "Upload Evidence",
    step3: "Generate Legal Complaint",
    loadingText: "Loading DHARMA...",
    recording: "Recording... Tap to Stop",
    tapToStart: "Tap to Start Recording",
    reRecord: "Re-record",
    saveContinue: "Save & Continue",
    localNotice: "Your recording is stored locally on this device. It will not be uploaded or shared without your explicit consent.",
    describeIncident: "Describe the Incident",
    incidentType: "Type of Incident",
    filedAgainst: "Filed Against",
    submitTo: "Submit To",
    generateComplaint: "Generate Legal Complaint",
    scstHelpline: "SC/ST Helpline: 14566",
    emergencyHelplines: "Emergency Helplines",
    uploadNotice: "Files are stored securely on your device.",
    disclaimer: "DHARMA is a documentation tool. It does not provide legal advice. Please consult a lawyer for guidance.",
    transcriptLabel: "Transcript",
      language: "Language",
  },
  HI: {
    home: "होम",
    record: "रिकॉर्ड",
    evidence: "साक्ष्य",
    complaint: "शिकायत",
    myCases: "मेरे मामले",
    heroTitle: "आपकी आवाज़। आपके अधिकार। आपका न्याय।",
    startRecording: "रिकॉर्डिंग शुरू करें",
    recentCases: "हाल के मामले",
    step1: "अपनी गवाही रिकॉर्ड करें",
    step2: "साक्ष्य अपलोड करें",
    step3: "कानूनी शिकायत तैयार करें",
    loadingText: "DHARMA लोड हो रहा है...",
    recording: "रिकॉर्डिंग हो रही है... रोकने के लिए टैप करें",
    tapToStart: "रिकॉर्डिंग शुरू करने के लिए टैप करें",
    reRecord: "फिर से रिकॉर्ड करें",
    saveContinue: "सहेजें और जारी रखें",
    localNotice: "आपकी रिकॉर्डिंग इस डिवाइस पर स्थानीय रूप से संग्रहीत है। आपकी स्पष्ट सहमति के बिना इसे अपलोड या साझा नहीं किया जाएगा।",
    describeIncident: "घटना का विवरण दें",
    incidentType: "घटना का प्रकार",
    filedAgainst: "किसके विरुद्ध",
    submitTo: "कहाँ जमा करें",
    generateComplaint: "कानूनी शिकायत तैयार करें",
    scstHelpline: "SC/ST हेल्पलाइन: 14566",
    emergencyHelplines: "आपातकालीन हेल्पलाइन",
    uploadNotice: "फ़ाइलें आपके डिवाइस पर सुरक्षित रूप से संग्रहीत हैं।",
    disclaimer: "DHARMA एक दस्तावेज़ीकरण उपकरण है। यह कानूनी सलाह नहीं देता। मार्गदर्शन के लिए किसी वकील से परामर्श लें।",
    transcriptLabel: "ट्रांसक्रिप्ट",
    language: "भाषा",
  },
  TA: {
    home: "Home",
    record: "Record",
    evidence: "Evidence",
    complaint: "Complaint",
    myCases: "My Cases",
    heroTitle: "Your Voice. Your Rights. Your Justice.",
    startRecording: "Start Recording",
    recentCases: "Recent Cases",
    step1: "Record Your Testimony",
    step2: "Upload Evidence",
    step3: "Generate Legal Complaint",
    loadingText: "Loading DHARMA...",
    recording: "Recording... Tap to Stop",
    tapToStart: "Tap to Start Recording",
    reRecord: "Re-record",
    saveContinue: "Save & Continue",
    localNotice: "Your recording is stored locally on this device. It will not be uploaded or shared without your explicit consent.",
    describeIncident: "Describe the Incident",
    incidentType: "Type of Incident",
    filedAgainst: "Filed Against",
    submitTo: "Submit To",
    generateComplaint: "Generate Legal Complaint",
    scstHelpline: "SC/ST Helpline: 14566",
    emergencyHelplines: "Emergency Helplines",
    uploadNotice: "Files are stored securely on your device.",
    disclaimer: "DHARMA is a documentation tool. It does not provide legal advice. Please consult a lawyer for guidance.",
    transcriptLabel: "Transcript",
    language: "Language",
  },
};
