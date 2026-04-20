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

export default api;
