"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { useEffect, useState } from 'react';
import { ModeToggle } from "../components/ModeToggle";

interface Activity {
    id: string;
    time: string;
    category: string;
    description: string;
    quantity: string;
}

export default function Home() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState({
        category: '',
        description: '',
        quantity: '',
    });
    const { toast } = useToast()

    // Get data from localStorage when load the page
    useEffect(() => {
        const storedActivities = localStorage.getItem('activities');
        if (storedActivities) {
            setActivities(JSON.parse(storedActivities));
        }
    }, []);

    const handleAddActivity = () => {
        // Avoid to add new activity unless fill all fields
        if (!newActivity.category || !newActivity.description || !newActivity.quantity) {
            toast({
                variant: "error",
                title: "Por favor, preencha todos os campos.",
            })
            return;
        }

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const updatedActivities = [
            {
                id: String(activities.length + 1),
                time: `${currentDate} ${currentTime}`,
                ...newActivity,
            },
            ...activities,
        ];

        // Update the state activites with new activity
        setActivities(updatedActivities);
        // Update data on localStorage
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        // Clear all fields on form
        setNewActivity({
          category: '',
          description: '',
          quantity: '',
        });

        // Show toast when add new activity
        toast({
            variant: "success",
            title: "Novo item adicionado com sucesso!",
        })
    };

    const handleDeleteActivity = (id: string) => {
        // Filter activities to remove the activity with match ID
        const updatedActivities = activities.filter(activity => activity.id !== id)

        // Update state activities without activity removed
        setActivities(updatedActivities)

        localStorage.setItem('activities', JSON.stringify(updatedActivities))

        toast({
            title: "Atividade removida!",
        })
    }

    return (
        <>
            <div className="py-8 h-screen">
                <div className="container relative">
                    <h1 className="font-bold text-center text-xl mb-6 ">PET Control</h1>
                    <div className="absolute left-0 top-0">
                        <ModeToggle />
                    </div>
                    <div className="flex gap-4 mb-8">
                        <Select
                        value={newActivity.category}
                        onValueChange={(category) => setNewActivity({ ...newActivity, category })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="medecine">Medecine</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="text"
                            placeholder="Description"
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        />
                        <Input
                            type="text"
                            placeholder="Quantity"
                            value={newActivity.quantity}
                            onChange={(e) => setNewActivity({ ...newActivity, quantity: e.target.value })}
                        />
                        <Button variant="outline" onClick={handleAddActivity} className="hover:bg-">
                            Add
                        </Button>
                    </div>
                    <Table>
                        <TableCaption>A list of your recent activities</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Realizado em</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Description</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="font-medium">{activity.id}</TableCell>
                                    <TableCell>{activity.time}</TableCell>
                                    <TableCell>{activity.category}</TableCell>
                                    <TableCell className="text-right ">{activity.description}</TableCell>
                                    <TableCell className="text-right">{activity.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" onClick={() => handleDeleteActivity(activity.id)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ) )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
