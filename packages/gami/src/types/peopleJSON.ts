export type Interests = {
  name: string;
  description: string;
}[];

export type Experience = {
  title: string;
  companyName: string;
  location?: string;
  startTime: string;
  endTime?: string;
  isCurrent?: boolean;
  industry: string;
  description?: string;
}[];

export type Education = {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  location?: string;
  grade?: string;
  startTime: string;
  endTime?: string;
  isCurrent?: boolean;
  description?: string;
}[];
