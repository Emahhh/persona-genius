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
