import {Link} from "react-router-dom";
import {Card, Image} from "semantic-ui-react";
import {cardIcons} from "./consts";

export const CardGroups = ({items}) => {
    return (
        <Card.Group itemsPerRow={4}>
            {items?.map((item, i) => {
                const {icon, ...restImage} = item.image;
                return (
                    <Card key={i} as={Link} to={item.link}>
                        <Image src={cardIcons[icon]} {...restImage}/>
                        <Card.Content textAlign="center">
                            <Card.Header>{item.text}</Card.Header>
                        </Card.Content>
                    </Card>
                )
            })}
        </Card.Group>
    );
};