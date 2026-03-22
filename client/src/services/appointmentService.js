import axios from "axios";

const API = "http://localhost:5000/api/appointments";


export const getBookedDates = (professionalId)=>{
return axios.get(`${API}/booked/${professionalId}`);
};


export const bookAppointment = (data,token)=>{
return axios.post(
`${API}/book`,
data,
{headers:{Authorization:`Bearer ${token}`}}
);
};


export const getProfessionalAppointments = (token)=>{
return axios.get(
`${API}/professional`,
{headers:{Authorization:`Bearer ${token}`}}
);
};


export const acceptAppointment = (id,token)=>{
return axios.put(
`${API}/accept/${id}`,
{},
{headers:{Authorization:`Bearer ${token}`}}
);
};


export const rejectAppointment = (id,token)=>{
return axios.put(
`${API}/reject/${id}`,
{},
{headers:{Authorization:`Bearer ${token}`}}
);
};