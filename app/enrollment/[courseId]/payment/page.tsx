import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";


interface PageProps {
 params: Promise<{courseId:string}>
}


export default async function PaymentPage({params}:PageProps){

const {courseId}=await params;

const course = await prisma.course.findUnique({
where:{
 id:Number(courseId)
}
});


if(!course) notFound();


return (

<div className="min-h-screen bg-yellow-50 p-10">

<div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-8">


<h1 className="text-3xl font-bold">
Paiement : {course.title}
</h1>


<p className="mt-5 text-xl">
Montant :
<strong> 15$</strong>
</p>

<PaymentButton courseId={course.id} userId={1}/>


</div>

</div>


)

}