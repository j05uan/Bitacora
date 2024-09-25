const timeMessage = document.getElementById('timeMessage');
const currentHour = new Date().getHours();
const username = document.getElementById('username').value;

let message = '';

if (currentHour >= 5 && currentHour < 12) {
    message = '¡Buenos días, ${username} !';
} else if (currentHour >= 12 && currentHour < 18) {
    message = '¡Buenas tardes, ${username}!';
} else if (currentHour >= 18 && currentHour < 21) {
    message = '¡Buenas noches, ${username}!';
} else {
    message = '¡Es tarde, ${username}!';
}

timeMessage.textContent = message;

const acces = document.getElementById('Access');
const invisiblelis = document.getElementById('invisiblelis');

acces.addEventListener('click', () => {
    invisiblelis.style.display= "block";

});

const crudOptionsForm = document.getElementById('crudOptionsForm');
const activityFormElement = document.getElementById('activityFormElement');
const activityList = document.getElementById('activityList');
const activityForm = document.getElementById('activityForm');
const cancelBtn = document.getElementById('cancelBtn');

let activities = [];
let editingIndex = -1;

// Mostrar el formulario para crear actividad
document.getElementById('createActivityBtn').addEventListener('click', () => {
    crudOptionsForm.style.display = 'none';
    activityForm.style.display = 'block';
    activityList.style.display = 'none';
    document.getElementById('formTitle').innerText = 'Crear Actividad';
    activityFormElement.reset();
    editingIndex = -1;
});

// Leer actividades (mostrar lista)
document.getElementById('readActivitiesBtn').addEventListener('click', async () => {
    activityForm.style.display = 'none';
    activityList.style.display = 'block';
    await fetchActivities();
});

// Actualizar actividad
document.getElementById('updateActivityBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice de la actividad a actualizar (0, 1, 2...):");
    if (index >= 0 && index < activities.length) {
        editActivity(index);
    } else {
        alert("Índice no válido.");
    }
});

// Eliminar actividad
document.getElementById('deleteActivityBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice de la actividad a eliminar (0, 1, 2...):");
    if (index >= 0 && index < activities.length) {
        deleteActivity(index);
    } else {
        alert("Índice no válido.");
    }
});

// Función para obtener actividades
async function fetchActivities() {
    const response = await fetch('http://localhost:8080/activities');
    if (response.ok) {
        activities = await response.json();
        renderActivities();
    } else {
        alert('Error al obtener actividades.');
    }
}

// Función para renderizar actividades
function renderActivities() {
    activityList.innerHTML = '';
    activities.forEach((activity, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${activity.activityName}</h3>
            <p>${activity.description}</p>
        `;
        activityList.appendChild(div);
    });
}

// Editar actividad
async function editActivity(index) {
    const activity = activities[index];
    document.getElementById('activityId').value = index;
    document.getElementById('activityName').value = activity.activityName;
    document.getElementById('description').value = activity.description;
    document.getElementById('projectId').value = activity.projectId;
    document.getElementById('activityTypeId').value = activity.activityTypeId;
    document.getElementById('activityStatusId').value = activity.activityStatusId;
    document.getElementById('priorityId').value = activity.priorityId;
    document.getElementById('createdByUserId').value = activity.createdByUserId;

    activityForm.style.display = 'block';
    activityList.style.display = 'none';
    document.getElementById('formTitle').innerText = 'Actualizar Actividad';
    editingIndex = index; // Set editing index
}

// Eliminar actividad
async function deleteActivity(index) {
    const activityId = activities[index].id; // Asegúrate de que tu actividad tenga un campo 'id'
    const response = await fetch(`http://localhost:8080/activities/${activityId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        activities.splice(index, 1);
        renderActivities();
    } else {
        alert('Error al eliminar actividad.');
    }
}

// Guardar actividad
activityFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const activity = {
        projectId: parseInt(document.getElementById('projectId').value),
        activityTypeId: parseInt(document.getElementById('activityTypeId').value),
        activityStatusId: parseInt(document.getElementById('activityStatusId').value),
        priorityId: parseInt(document.getElementById('priorityId').value),
        createdByUserId: parseInt(document.getElementById('createdByUserId').value),
        activityName: document.getElementById('activityName').value,
        description: document.getElementById('description').value,
    };

    if (editingIndex >= 0) {
        // Actualizar actividad
        const activityId = activities[editingIndex].id; // Asegúrate de que tu actividad tenga un campo 'id'
        const response = await fetch(`http://localhost:8080/activities/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        });
        if (response.ok) {
            activities[editingIndex] = activity;
        } else {
            alert('Error al actualizar actividad.');
        }
    } else {
        // Crear nueva actividad
        const response = await fetch('http://localhost:8080/activities/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        });
        if (response.ok) {
            const newActivity = await response.json();
            activities.push(newActivity);
        } else {
            alert('Error al crear actividad.');
        }
    }

    activityForm.style.display = 'none'; // Ocultar formulario
    activityList.style.display = 'block'; // Mostrar lista
    renderActivities(); // Re-renderizar lista de actividades
});

// Botón de cancelar
cancelBtn.addEventListener('click', () => {
    activityForm.style.display = 'none';
});

const crudOptionsFormDepartments = document.getElementById('crudOptionsFormDepartments');
const departmentFormElement = document.getElementById('departmentFormElement');
const departmentList = document.getElementById('departmentList');
const departmentForm = document.getElementById('departmentForm');
const cancelDepartmentBtn = document.getElementById('cancelDepartmentBtn');

let departments = [];
let editingDepartmentIndex = -1;

// Mostrar el formulario para crear departamento
document.getElementById('createDepartmentBtn').addEventListener('click', () => {
    departmentForm.style.display = 'block';
    departmentList.style.display = 'none';
    document.getElementById('formTitleDepartment').innerText = 'Crear Departamento';
    departmentFormElement.reset();
    editingDepartmentIndex = -1; // Reset index for creating
});

// Leer departamentos (mostrar lista)
document.getElementById('readDepartmentsBtn').addEventListener('click', async () => {
    departmentForm.style.display = 'none';
    departmentList.style.display = 'block';
    await fetchDepartments();
});

// Actualizar departamento
document.getElementById('updateDepartmentBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice del departamento a actualizar (0, 1, 2...):");
    if (index >= 0 && index < departments.length) {
        editDepartment(index);
    } else {
        alert("Índice no válido.");
    }
});

// Eliminar departamento
document.getElementById('deleteDepartmentBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice del departamento a eliminar (0, 1, 2...):");
    if (index >= 0 && index < departments.length) {
        deleteDepartment(index);
    } else {
        alert("Índice no válido.");
    }
});

// Función para obtener departamentos
async function fetchDepartments() {
    const response = await fetch('http://localhost:8080/departments');
    if (response.ok) {
        departments = await response.json();
        renderDepartments();
    } else {
        alert('Error al obtener departamentos.');
    }
}

// Función para renderizar departamentos
function renderDepartments() {
    departmentList.innerHTML = '';
    departments.forEach((department, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${department.departmentName}</h3>
            <p>${department.description}</p>
        `;
        departmentList.appendChild(div);
    });
}

// Editar departamento
async function editDepartment(index) {
    const department = departments[index];
    document.getElementById('departmentId').value = index; // Store index in hidden input
    document.getElementById('departmentName').value = department.departmentName;
    document.getElementById('descriptionDepartment').value = department.description;

    departmentForm.style.display = 'block';
    departmentList.style.display = 'none';
    document.getElementById('formTitleDepartment').innerText = 'Actualizar Departamento';
    editingDepartmentIndex = index; // Set editing index
}

// Eliminar departamento
async function deleteDepartment(index) {
    const departmentId = departments[index].id; // Asegúrate de que tu departamento tenga un campo 'id'
    const response = await fetch(`http://localhost:8080/departments/${departmentId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        departments.splice(index, 1);
        renderDepartments();
    } else {
        alert('Error al eliminar departamento.');
    }
}

// Guardar departamento
departmentFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const department = {
        departmentName: document.getElementById('departmentName').value,
        description: document.getElementById('descriptionDepartment').value,
    };

    if (editingDepartmentIndex >= 0) {
        // Actualizar departamento
        const departmentId = departments[editingDepartmentIndex].id; // Asegúrate de que tu departamento tenga un campo 'id'
        const response = await fetch(`http://localhost:8080/departments/${departmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(department)
        });
        if (response.ok) {
            departments[editingDepartmentIndex] = department;
        } else {
            alert('Error al actualizar departamento.');
        }
    } else {
        // Crear nuevo departamento
        const response = await fetch('http://localhost:8080/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(department)
        });
        if (response.ok) {
            const newDepartment = await response.json();
            departments.push(newDepartment);
        } else {
            alert('Error al crear departamento.');
        }
    }

    departmentForm.style.display = 'none'; // Ocultar formulario
    departmentList.style.display = 'block'; // Mostrar lista
    renderDepartments(); // Re-renderizar lista de departamentos
});

// Botón de cancelar
cancelDepartmentBtn.addEventListener('click', () => {
    departmentForm.style.display = 'none';
});

const crudOptionsFormProjects = document.getElementById('crudOptionsFormProjects');
const projectFormElement = document.getElementById('projectFormElement');
const projectList = document.getElementById('projectList');
const projectForm = document.getElementById('projectForm');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');

let projects = [];
let editingProjectIndex = -1;

// Mostrar el formulario para crear proyecto
document.getElementById('createProjectBtn').addEventListener('click', () => {
    projectForm.style.display = 'block';
    projectList.style.display = 'none';
    document.getElementById('formTitleProject').innerText = 'Crear Proyecto';
    projectFormElement.reset();
    editingProjectIndex = -1; // Reset index for creating
});

// Leer proyectos (mostrar lista)
document.getElementById('readProjectsBtn').addEventListener('click', async () => {
    projectForm.style.display = 'none';
    projectList.style.display = 'block';
    await fetchProjects();
});

// Actualizar proyecto
document.getElementById('updateProjectBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice del proyecto a actualizar (0, 1, 2...):");
    if (index >= 0 && index < projects.length) {
        editProject(index);
    } else {
        alert("Índice no válido.");
    }
});

// Eliminar proyecto
document.getElementById('deleteProjectBtn').addEventListener('click', () => {
    const index = prompt("Introduce el índice del proyecto a eliminar (0, 1, 2...):");
    if (index >= 0 && index < projects.length) {
        deleteProject(index);
    } else {
        alert("Índice no válido.");
    }
});

// Función para obtener proyectos
async function fetchProjects() {
    const response = await fetch('http://localhost:8080/projects');
    if (response.ok) {
        projects = await response.json();
        renderProjects();
    } else {
        alert('Error al obtener proyectos.');
    }
}

// Función para renderizar proyectos
function renderProjects() {
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${project.projectName}</h3>
            <p>${project.description}</p>
            <p>Fecha de Inicio: ${project.startDate}</p>
            <p>Fecha de Fin: ${project.endDate}</p>
        `;
        projectList.appendChild(div);
    });
}

// Editar proyecto
async function editProject(index) {
    const project = projects[index];
    document.getElementById('projectId').value = index; // Store index in hidden input
    document.getElementById('projectName').value = project.projectName;
    document.getElementById('descriptionProject').value = project.description;
    document.getElementById('startDate').value = project.startDate;
    document.getElementById('endDate').value = project.endDate;
    document.getElementById('departmentId').value = project.departmentId;

    projectForm.style.display = 'block';
    projectList.style.display = 'none';
    document.getElementById('formTitleProject').innerText = 'Actualizar Proyecto';
    editingProjectIndex = index; // Set editing index
}

// Eliminar proyecto
async function deleteProject(index) {
    const projectId = projects[index].id; // Asegúrate de que tu proyecto tenga un campo 'id'
    const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        projects.splice(index, 1);
        renderProjects();
    } else {
        alert('Error al eliminar proyecto.');
    }
}

// Guardar proyecto
projectFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const project = {
        projectName: document.getElementById('projectName').value,
        description: document.getElementById('descriptionProject').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        departmentId: parseInt(document.getElementById('departmentId').value),
    };

    if (editingProjectIndex >= 0) {
        // Actualizar proyecto
        const projectId = projects[editingProjectIndex].id; // Asegúrate de que tu proyecto tenga un campo 'id'
        const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        });
        if (response.ok) {
            projects[editingProjectIndex] = project;
        } else {
            alert('Error al actualizar proyecto.');
        }
    } else {
        // Crear nuevo proyecto
        const response = await fetch('http://localhost:8080/projects/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        });
        if (response.ok) {
            const newProject = await response.json();
            projects.push(newProject);
        } else {
            alert('Error al crear proyecto.');
        }
    }

    projectForm.style.display = 'none'; // Ocultar formulario
    projectList.style.display = 'block'; // Mostrar lista
    renderProjects(); // Re-renderizar lista de proyectos
});

// Botón de cancelar
cancelProjectBtn.addEventListener('click', () => {
    projectForm.style.display = 'none';
});

// Render inicial
fetchProjects();
fetchDepartments();
fetchActivities();

