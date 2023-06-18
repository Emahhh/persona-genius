// INTERFACES
export interface Project {
    prjName: string;
    owner: string;
    prjDescription: string;
    invitedUsers: Record<string, Invitation>;
    personas: Record<string, Persona>;
    // TODO: add last edit timestamp and order by it
}

export interface Invitation {
    invitedUserId: string;
    status: string;
    timestamp: string;
}

export interface Persona {
    name: string;
    description: string;
    goals: string;
    needs: string;
    frustrations: string;
    image: string;
    job: string;
    // TODO: inserire per ordinare? lastEdit: string;
    // TODO: chat?
}

// VALIDATION
export function validatePersona(pers: Persona): boolean {
    if (!pers.name || !pers.description || !pers.goals || !pers.needs || !pers.frustrations || !pers.image || !pers.job) {
        return false;
    }
    return true;
}

// JSON TO OBJECT
export function jsonToPersona(json: string): Persona {
    const objPersona = JSON.parse(json);
    console.log(objPersona);
    if (!validatePersona(objPersona)) {
        throw new Error("Invalid persona");
    }
    return objPersona;
}

