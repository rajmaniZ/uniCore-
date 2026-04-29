const toArray = (value) => (Array.isArray(value) ? value : []);

export const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }
  return "";
};

export const idsEqual = (left, right) => {
  const leftId = getId(left);
  const rightId = getId(right);
  return Boolean(leftId) && leftId === rightId;
};

const dedupeBy = (items, keyBuilder) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyBuilder(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getConfigDepartments = (config) => toArray(config?.departments);
export const getConfigClasses = (config) => toArray(config?.classes);

export const getConfigSubjectScopes = (config) => {
  const scopes = [];

  getConfigClasses(config).forEach((classEntry) => {
    toArray(classEntry?.subjects).forEach((subjectEntry) => {
      scopes.push({
        level: "school",
        classId: getId(classEntry?.class),
        className: classEntry?.class?.name || "",
        subjectId: getId(subjectEntry?.subject),
        subject: subjectEntry?.subject || null,
        teacherId: getId(subjectEntry?.teacher),
        teacher: subjectEntry?.teacher || null,
      });
    });
  });

  getConfigDepartments(config).forEach((departmentEntry) => {
    const departmentId = getId(departmentEntry?.department);

    toArray(departmentEntry?.courses).forEach((courseEntry) => {
      const courseId = getId(courseEntry?.course);
      const systemType = courseEntry?.systemType || "semester";

      toArray(courseEntry?.structure).forEach((structureEntry) => {
        toArray(structureEntry?.subjects).forEach((subjectEntry) => {
          scopes.push({
            level: "college",
            departmentId,
            departmentName: departmentEntry?.department?.name || "",
            courseId,
            courseName: courseEntry?.course?.name || "",
            systemType,
            semester: Number(structureEntry?.number) || 0,
            subjectId: getId(subjectEntry?.subject),
            subject: subjectEntry?.subject || null,
            teacherId: getId(subjectEntry?.teacher),
            teacher: subjectEntry?.teacher || null,
          });
        });
      });
    });
  });

  return scopes.filter((scope) => scope.subjectId);
};

export const getDepartmentCourseOptions = (config, departmentId) => {
  const department = getConfigDepartments(config).find((entry) =>
    idsEqual(entry?.department, departmentId)
  );

  return toArray(department?.courses);
};

export const getStructureOptions = (config, departmentId, courseId) => {
  const courseEntry = getDepartmentCourseOptions(config, departmentId).find(
    (entry) => idsEqual(entry?.course, courseId)
  );

  return toArray(courseEntry?.structure).map((entry) => ({
    number: Number(entry?.number) || 0,
    label:
      (courseEntry?.systemType || "semester") === "annual"
        ? `Year ${entry?.number}`
        : `Semester ${entry?.number}`,
  }));
};

export const getScopedSubjects = (config, filters = {}) => {
  const { departmentId, courseId, semester, teacherId, classId } = filters;

  return getConfigSubjectScopes(config).filter((scope) => {
    if (departmentId && !idsEqual(scope.departmentId, departmentId)) return false;
    if (courseId && !idsEqual(scope.courseId, courseId)) return false;
    if (semester && Number(scope.semester) !== Number(semester)) return false;
    if (teacherId && !idsEqual(scope.teacherId, teacherId)) return false;
    if (classId && !idsEqual(scope.classId, classId)) return false;
    return true;
  });
};

export const getUniqueSubjects = (scopes) =>
  dedupeBy(scopes, (scope) => scope.subjectId).map((scope) => ({
    ...scope.subject,
    _id: scope.subjectId,
    teacher: scope.teacher,
    teacherId: scope.teacherId,
    departmentId: scope.departmentId || "",
    courseId: scope.courseId || "",
    semester: scope.semester || null,
    classId: scope.classId || "",
    level: scope.level,
  }));

export const getTeacherSubjectScopes = (config, teacherId) =>
  getScopedSubjects(config, { teacherId });

export const getStudentSubjectScopes = (config, user) => {
  if (!user) return [];

  if (user.classId) {
    return getScopedSubjects(config, {
      classId: getId(user.classId),
    });
  }

  return getScopedSubjects(config, {
    departmentId: getId(user.departmentId),
    courseId: getId(user.courseId),
    semester: user.semester,
  });
};

export const getRoleSubjectScopes = (config, user) => {
  const role = user?.role?.toLowerCase();

  if (role === "teacher") {
    return getTeacherSubjectScopes(config, user?._id);
  }

  if (role === "student") {
    return getStudentSubjectScopes(config, user);
  }

  if (role === "hod") {
    return getScopedSubjects(config, {
      departmentId: getId(user?.departmentId),
    });
  }

  return getConfigSubjectScopes(config);
};

export const getRoleSubjects = (config, user) =>
  getUniqueSubjects(getRoleSubjectScopes(config, user));

export const getRoleConfigSummary = (config, user) => {
  const role = user?.role?.toLowerCase();
  const subjectScopes = getRoleSubjectScopes(config, user);

  if (role === "student") {
    return {
      departments: 0,
      classes: user?.classId ? 1 : 0,
      courses: user?.courseId ? 1 : 0,
      subjects: subjectScopes.length,
    };
  }

  if (role === "teacher") {
    return {
      departments: dedupeBy(subjectScopes, (scope) => scope.departmentId || scope.classId).length,
      classes: dedupeBy(subjectScopes.filter((scope) => scope.level === "school"), (scope) => scope.classId).length,
      courses: dedupeBy(subjectScopes.filter((scope) => scope.level === "college"), (scope) => scope.courseId).length,
      subjects: subjectScopes.length,
    };
  }

  if (role === "hod") {
    const departmentScopes = subjectScopes.filter((scope) => scope.level === "college");
    return {
      departments: getId(user?.departmentId) ? 1 : 0,
      classes: 0,
      courses: dedupeBy(departmentScopes, (scope) => scope.courseId).length,
      subjects: departmentScopes.length,
    };
  }

  return {
    departments: getConfigDepartments(config).length,
    classes: getConfigClasses(config).length,
    courses: getConfigDepartments(config).reduce(
      (count, departmentEntry) => count + toArray(departmentEntry?.courses).length,
      0
    ),
    subjects: getConfigSubjectScopes(config).length,
  };
};
