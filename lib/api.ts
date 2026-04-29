import * as SecureStore from "expo-secure-store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://app.archcitytutors.com/api/mobile-app",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getSelfProfile() {
  const res = await api.get("/user/self-profile");
  return res.data;
}

export async function getTutorApplications() {
  const res = await api.get("/tutor/applications");
  return res.data;
}

export async function getTutorStats() {
  const res = await api.get("/tutor/stats");
  return res.data;
}

export async function getTutorSchedules() {
  const res = await api.get("/tutor/schedules");
  return res.data;
}

export async function getTutorScheduleById(id: string) {
  const res = await api.get(`/tutor/schedules/${id}`);
  return res.data;
}

export async function getTutorEarnings() {
  const res = await api.get("/tutor/earnings");
  return res.data;
}

export async function getScheduleMessages(scheduleId: string) {
  const res = await api.get(`/tutor/schedules/${scheduleId}/messages`);
  return res.data;
}

export async function sendScheduleMessage(scheduleId: string, content: string) {
  const res = await api.post(`/tutor/schedules/${scheduleId}/messages`, { content });
  return res.data;
}

export async function getStudentStatus() {
  const res = await api.get("/student/status");
  return res.data as { isSubscribed: boolean };
}

export async function getStudentStats() {
  const res = await api.get("/student/stats");
  return res.data;
}

export async function getStudentHistory() {
  const res = await api.get("/student/history");
  return res.data;
}

export async function findTutors(params: Record<string, string>) {
  const res = await api.get("/student/tutors", { params });
  return res.data;
}

export async function getStudentSchedules() {
  const res = await api.get("/student/schedules");
  return res.data;
}

export async function getStudentScheduleById(id: string) {
  const res = await api.get(`/student/schedules/${id}`);
  return res.data;
}

export async function getStudentScheduleMessages(scheduleId: string) {
  const res = await api.get(`/student/schedules/${scheduleId}/messages`);
  return res.data;
}

export async function sendStudentScheduleMessage(scheduleId: string, content: string) {
  const res = await api.post(`/student/schedules/${scheduleId}/messages`, { content });
  return res.data;
}

export async function cancelStudentSchedule(scheduleId: string) {
  const res = await api.post(`/student/schedules/${scheduleId}/cancel`);
  return res.data;
}

export async function requestStudentAssistance(scheduleId: string, message: string) {
  const res = await api.post(`/student/schedules/${scheduleId}/assistance`, { message });
  return res.data;
}

export async function getTutorProfile(tutorId: string) {
  const res = await api.get(`/student/tutors/${tutorId}`);
  return res.data;
}

export async function getTutorAvailabilities(tutorId: string) {
  const res = await api.get(`/student/tutors/${tutorId}/availabilities`);
  return res.data;
}

export async function bookMultipleTutor(
  tutorId: string,
  availabilities: {
    id: string;
    title: string;
    duration: number;
    location: string;
    selectedInPersonLocation?: string;
  }[],
) {
  const res = await api.post(`/student/tutors/${tutorId}/book-multiple`, { availabilities });
  return res.data as { url: string };
}

export async function bookTutor(
  tutorId: string,
  data: {
    availabilityId: string;
    duration: number;
    location: string;
    title: string;
    selectedInPersonLocation?: string;
  },
) {
  const res = await api.post(`/student/tutors/${tutorId}/book`, data);
  return res.data as { url: string };
}

// ─── Parent API ───────────────────────────────────────────────────────────────

export async function getParentStatus() {
  const res = await api.get("/parent/status");
  return res.data as { isSubscribed: boolean };
}

export async function getParentStats() {
  const res = await api.get("/parent/stats");
  return res.data;
}

export async function getParentStudents() {
  const res = await api.get("/parent/students");
  return res.data;
}

export async function createParentStudent(data: { firstName: string; lastName: string; grade: string }) {
  const res = await api.post("/parent/students", data);
  return res.data;
}

export async function loginAsStudent(studentId: string) {
  const res = await api.post("/parent/students/login", { studentId });
  return res.data as { token: string };
}

export async function getParentHistory() {
  const res = await api.get("/parent/history");
  return res.data;
}

export async function findParentTutors(params: Record<string, string>) {
  const res = await api.get("/parent/tutors", { params });
  return res.data;
}

export async function getParentTutorProfile(tutorId: string) {
  const res = await api.get(`/parent/tutors/${tutorId}`);
  return res.data;
}

export async function getParentTutorAvailabilities(tutorId: string) {
  const res = await api.get(`/parent/tutors/${tutorId}/availabilities`);
  return res.data;
}

export async function bookTutorForStudent(
  tutorId: string,
  data: {
    studentId: string;
    availabilityId: string;
    duration: number;
    location: string;
    title: string;
    selectedInPersonLocation?: string;
  },
) {
  const res = await api.post(`/parent/tutors/${tutorId}/book`, data);
  return res.data as { url: string };
}

export async function bookMultipleTutorForStudent(
  tutorId: string,
  studentId: string,
  availabilities: {
    id: string;
    title: string;
    duration: number;
    location: string;
    selectedInPersonLocation?: string;
  }[],
) {
  const res = await api.post(`/parent/tutors/${tutorId}/book-multiple`, {
    studentId,
    availabilities,
  });
  return res.data as { url: string };
}

export async function getParentSchedules() {
  const res = await api.get("/parent/schedules");
  return res.data;
}

export async function getParentScheduleById(id: string) {
  const res = await api.get(`/parent/schedules/${id}`);
  return res.data;
}

export async function getParentScheduleMessages(scheduleId: string) {
  const res = await api.get(`/parent/schedules/${scheduleId}/messages`);
  return res.data;
}

export async function sendParentScheduleMessage(scheduleId: string, content: string) {
  const res = await api.post(`/parent/schedules/${scheduleId}/messages`, { content });
  return res.data;
}

export async function cancelParentSchedule(scheduleId: string) {
  const res = await api.post(`/parent/schedules/${scheduleId}/cancel`);
  return res.data;
}

export async function requestParentAssistance(scheduleId: string, message: string) {
  const res = await api.post(`/parent/schedules/${scheduleId}/assistance`, { message });
  return res.data;
}

export default api;
