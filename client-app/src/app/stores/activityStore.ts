import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../Models/activity';
import agent from '../api/agent'

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable activity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            runInAction('load activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });

                this.loadingInitial = false
            });
        } catch (error) {
            runInAction('load activities error', () => {
                this.loadingInitial = false;
            });

            throw error;
        }
    }

    @action loadActivity = async (id: string) => {
        this.loadingInitial = false;

        let activity = this.getActivity(id);

        if (activity)  
        {
            this.activity = activity;
        } else {
            try {
                activity = await agent.Activities.detatil(id);   
                runInAction('geting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                runInAction('get activity error', () => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }

    }

    @action clearActivity = () => {
        this.activity = undefined;
    }

    getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity)
            
            runInAction('create activity', () =>  {
                this.activityRegistry.set(activity.id, activity);
            this.editMode = false;
            this.submitting = false;   
            });
        } catch (error) {
            console.log(error);
            runInAction('create activity error', () => {
                this.submitting = false;   
            });
        }
    }

    @action editActivity = async (activity: IActivity)=> {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);

            runInAction('edit activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        } catch (error) {
            console.log(error);
            runInAction('edit activity error', () => {
                this.submitting = false;
            })
        }
    }

    @action selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('delete activity', () => {
                this.activityRegistry.delete(id);
            this.submitting = false;
            this.target = '';
            });
        } catch (error) {
            console.log(error)

            runInAction('delete activity error', () => {
                this.submitting = false;
                this.target = '';
            })
        }
    }

}

export default createContext(new ActivityStore())