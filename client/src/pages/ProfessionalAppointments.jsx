import { useEffect, useState } from "react";
import axios from "axios";

function ProfessionalAppointments(){

const [appointments,setAppointments] = useState([]);

const token = localStorage.getItem("token");


useEffect(() => {

  const loadAppointments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/appointments/professional",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointments(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  loadAppointments();

}, [token]);

const acceptAppointment = async(id)=>{

await axios.put(
`http://localhost:5000/api/appointments/accept/${id}`,
{},
{headers:{Authorization:`Bearer ${token}`}}
);

fetchAppointments();

};



const rejectAppointment = async(id)=>{

await axios.put(
`http://localhost:5000/api/appointments/reject/${id}`,
{},
{headers:{Authorization:`Bearer ${token}`}}
);

fetchAppointments();

};



return(

<div className="min-h-screen bg-blue-50 p-10">

<h1 className="text-3xl font-bold text-blue-700 mb-8">
Appointment Requests
</h1>


<div className="grid gap-6">

{appointments.map((a)=>(
<div
key={a._id}
className="bg-white p-6 rounded-xl shadow-md border flex justify-between items-center"
>

<div>

<h2 className="text-lg font-semibold">
{a.user.name}
</h2>

<p className="text-gray-500">
Service: {a.service}
</p>

<p className="text-gray-500">
Date: {new Date(a.date).toDateString()}
</p>

<p className={`mt-1 font-semibold
${a.status==="accepted" ? "text-green-600" :
a.status==="rejected" ? "text-red-600" :
"text-yellow-600"}
`}>

Status: {a.status}

</p>

</div>


<div className="flex gap-3">

<button
onClick={()=>acceptAppointment(a._id)}
className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
>

Accept

</button>

<button
onClick={()=>rejectAppointment(a._id)}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>

Reject

</button>

</div>

</div>
))}

</div>

</div>

);

}

export default ProfessionalAppointments;