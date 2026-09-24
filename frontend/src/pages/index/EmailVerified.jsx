import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router';

export default function EmailVerified() {
    
    return (
        <div className="md:max-w-[40%] mx-auto">
            <div className="card text-center gap-3">
                <Avatar className="bg-green-500 text-white" icon="pi pi-check-circle" size="large" />
                <div className="text-2xl my-4 font-bold text-green-500">
                    Email verification completed.
                </div>
                <Divider />
                <Link to="/">
                    <Button icon="pi pi-home" label="Continue" />
                </Link>
            </div>
        </div>
    );
}
