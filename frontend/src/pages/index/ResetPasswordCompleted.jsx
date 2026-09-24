import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router';

export default function AccountBlocked() {
    
    return (
        <div className="md:max-w-[40%] mx-auto">
            <div className="card my-4 text-center ">
                <div className="flex gap-4 items-center justify-center">
                    <Avatar className="mb-3 bg-green-700 text-green-100" icon="pi pi-check-circle" size="large" />
                    <div className="text-2xl font-bold">Password Reset </div>
                </div>
                <Divider />
                <div className="font-bold text-gray-600">
                    Your password has been changed successfully
                </div>
                <Divider />
                <Link to="/">
                    <Button className="p-button-text" label="Click here to login" />
                </Link>
            </div>
        </div>
    );
}
