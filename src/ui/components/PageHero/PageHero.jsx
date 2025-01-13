import React from "react";
import dayjs from "dayjs";
import {Header, Image, Segment} from "semantic-ui-react";
import {cardIcons, iconsNames} from "../CardGroups/consts.jsx";

export const PageHero = ({header, icon = iconsNames.add_model, labels, date = null, children, loading = false}) => {

    return (
        <div className="noprint">
            <Segment loading={loading} style={{minHeight: "5rem"}} placeholder>
                {labels}
                <Header textAlign="center">
                    <Image src={cardIcons[icon]} size="large"/>
                    <h1>
                        {header}
                    </h1>
                    {date && <span>{dayjs(date).format("DD/MM/YYYY")}</span>}
                    {children}
                </Header>
            </Segment>
        </div>
    );
};
