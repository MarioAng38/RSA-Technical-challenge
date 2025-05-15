export function isValidTask(task) {
    return (
        typeof task.title === 'string' &&
        typeof task.type === 'string' &&
        typeof task.status === 'string' &&
        typeof task.assigned_to === 'string' &&
        typeof task.estimated_hours === 'number' &&
        typeof task.actual_hours === 'number' &&
        !isNaN(new Date(task.created_at)) &&
        (!task.closed_at || !isNaN(new Date(task.closed_at)))
    );
}

export function validateTasks(sprints) {
    if(!Array.isArray(sprints)) {
        console.error('Datele nu sunt o lista de sprinturi!');
        return [];
    }
    const validSprints = sprints.map(sprint => ({
        ...sprint,
        tasks: Array.isArray(sprint.tasks)
        ? sprint.tasks.filter(isValidTask)
        : []
    }));

    return validSprints;
}