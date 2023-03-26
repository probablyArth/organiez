export interface IUser {
  id: string;
  uid: string;
  gmail: string;
  avatar: string;
  name: string;
}

export interface IEvent {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  members: string[];
}

export interface ITask {
  id: string;
  eventId: string;
  assigned: string | null;
  description: string;
  status: STATUS;
}

export enum STATUS {
  "NOT_STARTED",
  "STARTED",
  "FINISHED",
}
