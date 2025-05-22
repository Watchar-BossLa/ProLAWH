
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>PL</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>ProLawh User</CardTitle>
            <CardDescription>user@example.com</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Personal Information</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p>ProLawh User</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>user@example.com</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>San Francisco, CA</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p>January 2025</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Skills & Expertise</h3>
              <Separator className="my-2" />
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="secondary" size="sm" className="rounded-full">Machine Learning</Button>
                <Button variant="secondary" size="sm" className="rounded-full">Data Science</Button>
                <Button variant="secondary" size="sm" className="rounded-full">Python</Button>
                <Button variant="secondary" size="sm" className="rounded-full">Sustainability</Button>
                <Button variant="secondary" size="sm" className="rounded-full">Project Management</Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
