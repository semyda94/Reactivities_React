import React from 'react'
import { Item, Button, Segment, Icon, ItemGroup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { IActivity } from '../../../app/Models/activity';
import { observer } from 'mobx-react-lite';


const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {

    return (
        <Segment.Group>
            <Segment>
                <ItemGroup>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by Bob
                        </Item.Description>
                        </Item.Content>
                    </Item>
                </ItemGroup>
            </Segment>

            <Segment>
                <Icon name='clock' /> {activity.date}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>

            <Segment secondary>
                Attendees will go here
            </Segment>

            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    exact={'true'}
                    to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue'
                />
            </Segment>
        </Segment.Group>
    )
}


export default observer(ActivityListItem);