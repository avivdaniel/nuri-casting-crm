import {CardGroups} from "@/ui/components/CardGroups/CardGroups.jsx";
import {route as PublicCreateModelRoute} from '@/pages/public/create-models/route.jsx';

export const items = [
    {
        link: PublicCreateModelRoute.path,
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