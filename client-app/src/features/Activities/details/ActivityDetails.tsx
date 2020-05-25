import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetaledHeader from './ActivityDetaledHeader';
import ActivityDetaledInfo from './ActivityDetaledInfo';
import ActivityDetailedChat from './ActivityDetailedChat'
import ActivityDetaledSidebar from './ActivityDetaledSidebar'

interface DetailParams {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {
    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]);

    if (loadingInitial || !activity) return <LoadingComponent content='Loading Activity...' />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetaledHeader activity={activity} />
                <ActivityDetaledInfo activity={activity}/>
                <ActivityDetailedChat />
            </Grid.Column>

            <Grid.Column width={6}>
                <ActivityDetaledSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails);