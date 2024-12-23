import * as React from 'react';
import {
    Grid,
    Segment,
    CardContent,
    Card,
    Icon
} from 'semantic-ui-react';

import './Selected.models.scss';

export const SelectedModels = ({data = [], handleRemoveModel}) => {
    if (!data.length) return null;

    return (
        <Segment>
            <Grid className="SelectedModels" columns={5} divided={false}>
                {data.map((item) => {
                    return <Grid.Column key={item.value}>
                        <Card>
                            <CardContent>
                                <button onClick={() => handleRemoveModel(item.value)} className="delete-btn"><Icon
                                    name="delete"/></button>
                                <img
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        objectPosition: 'top',
                                        marginLeft: '15px'
                                    }}
                                    src={item.image}
                                />
                                <span>{item.label}</span>
                            </CardContent>
                        </Card>
                    </Grid.Column>

                })}
            </Grid>
        </Segment>
    );
};