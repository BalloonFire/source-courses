// Change the function to async
const CourseIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string }> // Update type to Promise
}) => {
    // Await the params here
    const { courseId } = await params;

    return ( 
        <div>
            Course Id: {courseId}
        </div>
     );
}
 
export default CourseIdPage;