import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router';


export default function AccountCreated() {
    
    return (
        <div className="md:max-w-[40%] mx-auto">
            <div className="text-center card">
                <Avatar size="large" className="bg-green-500 text-white" icon="pi pi-check-circle" />
                <div className="text-3xl my-3 font-bold text-green-500 my-3">
                    Congratulations!
                </div>
                <div className="text-2xl text-500">
                    Your account has been created.
                </div>
                <Divider />
                <Link to="/">
                    <Button label="Continue" icon="pi pi-home" />
                </Link>
            </div>
        </div>

    );
}