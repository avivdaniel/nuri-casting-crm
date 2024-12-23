import {CardGroups} from "../../components/Ui/CardGroups/CardGroups.jsx";

export const items = [
    {
        link: '/public/create-model',
        text: 'צור מיוצג חדש',
        image: {
            icon: 'add_model',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }
];

const GuestHome = () => {
 return <CardGroups items={items}/>

};

export default GuestHome;