import {
  addCourseToConfig,
  addDeptToConfig,
  addSubjectToConfig,
} from "../../../../api/configApi";
import { createDepartment } from "../../../../api/departmentApi";
import { createCourse } from "../../../../api/courseApi";
import { createSubject } from "../../../../api/subjectApi";
import { createHod, createTeacher } from "../../../../api/userAPI";

const toApiSubjectType = (value) => {
  const clean = String(value || "compulsory").toLowerCase();
  if (clean === "optional") return "fun";
  if (clean === "compulsory") return "complusory";
  return "elective";
};

export const syncCollegeSetup = async (data) => {
  try {
    const instituteId = data?.instituteId;

    for (const department of data?.departments || []) {
      const departmentResponse = await createDepartment({
        name: department.name,
        code: department.code,
        about: department.about,
        instituteId,
      });

      const departmentId = departmentResponse._id;
      await addDeptToConfig({ departmentId });

      if (department.hod?.email && department.hod?.name && department.hod?.employeeId) {
        await createHod({
          name: department.hod.name,
          email: department.hod.email,
          employeeId: department.hod.employeeId,
          departmentId,
          instituteId,
        });
      }

      const teacherMap = {};

      for (const teacher of department.teachers || []) {
        const response = await createTeacher({
          name: teacher.name,
          email: teacher.email,
          employeeId: teacher.employeeId,
          departmentId,
          instituteId,
        });

        const teacherId = response?.user?._id;
        if (teacherId) {
          teacherMap[teacher.email?.trim().toLowerCase()] = teacherId;
        }
      }

      for (const course of department.courses || []) {
        const courseResponse = await createCourse({
          name: course.name,
          code: course.code,
          departmentId,
          instituteId,
          duration: course.duration,
          type: course.type,
          description: course.description,
        });

        const courseId = courseResponse._id;

        await addCourseToConfig({
          departmentId,
          courseId,
          systemType: course.type,
          duration: course.duration,
        });

        for (const structure of course.structure || []) {
          for (const subject of structure.subjects || []) {
            const subjectResponse = await createSubject({
              name: subject.name,
              code: subject.code,
              instituteId,
              department: departmentId,
              course: courseId,
              semester: structure.number,
              type: toApiSubjectType(subject.subjectType),
            });

            const subjectId = subjectResponse._id;
            const teacherId =
              subject.teacher ||
              teacherMap[subject.teacherEmail?.trim().toLowerCase()] ||
              null;

            await addSubjectToConfig({
              departmentId,
              courseId,
              subjectId,
              structureNumber: structure.number,
              teacherId,
            });
          }
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("SYNC FAILED:", err.response?.data || err);
    return { success: false, error: err.response?.data?.msg || err.message };
  }
};
