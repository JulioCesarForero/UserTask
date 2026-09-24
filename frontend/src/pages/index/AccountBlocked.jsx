import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router';

export default function AccountBlocked() {
    
    return (
        <div className="md:max-w-[40%] mx-auto">
            <div className="text-center card">
                <Avatar className="bg-pink-500 text-white" size="large" icon="pi pi-ban" />
                <div className="text-3xl my-3  font-bold text-pink-500 my-3">
                    Your account has been blocked
                </div>
                <div className="text-500">
                    Please contact the system administrator for more information
                </div>
                <Divider />
                <Link to="/">
                    <Button label="Continue" icon="pi pi-home" />
                </Link>
            </div>
        </div>
    );
}
