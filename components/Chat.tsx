"use client"

import { useEffect, useState, FormEvent, useRef, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";

export type Message = {
    id?: string;
    role: "human" | "ai" | "placeholder";
    message: string;
    createdAt: Date;
};

function Chat({ id }: { id: string }) {
    const { user } = useUser();

    const [input, setInput] = useState("");
    const [message, setMessage] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();
    const bottomOfChatRef = useRef<HTMLDivElement>(null);

    const [snapshot, loading, error] = useCollection(
        user &&
            query(
                collection(db, "users", user?.id, "files", id, "chat"),
                orderBy("createdAt", "asc")
            )
    );

    useEffect(() => {
        bottomOfChatRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [message]);

    useEffect(() => {
        if (!snapshot) return;

        console.log("Updated snapshot", snapshot.docs);

        const lastMessage = message.pop();

        if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
            return;
        }

        const newMessages = snapshot.docs.map((doc) => {
            const { role, message, createdAt } = doc.data();

            return {
                id: doc.id,
                role,
                message,
                createdAt: createdAt.toDate(),
            };
        });
        setMessage(newMessages);
    }, [snapshot]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const q = input;

        setInput("");

        setMessage((prev) => [
            ...prev,
            {
                role: "human",
                message: q,
                createdAt: new Date(),
            },
            {
                role: "ai",
                message: "Thinking...",
                createdAt: new Date(),
            },
        ]);

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);

            if (!success) {
                // toast

                setMessage((prev) =>
                    prev.slice(0, prev.length - 1).concat([
                        {
                            role: "ai",
                            message: `Whoops... ${message}`,
                            createdAt: new Date(),
                        },
                    ])
                );
            }
        });
    };

    return (
        <div className="flex flex-col h-full overflow-scroll">
            <div className="flex-1 w-full">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="animate-spin h-20 w-20 mt-20 text-indigo-600" />
                    </div>
                ) : (
                    <div className="p-5">
                        {message.length === 0 && (
                            <ChatMessage
                                key={"placeholder"}
                                message={{
                                    role: "ai",
                                    message: "Ask me anything about the document!",
                                    createdAt: new Date(),
                                }}
                            />
                        )}

                        {message.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}

                        <div ref={bottomOfChatRef} />
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
            >
                <Input
                    placeholder="Ask Me A Question"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button type="submit" disabled={!input || isPending}>
                    {isPending ? (
                        <Loader2Icon className="animate-spin text-indigo-600" />
                    ) : (
                        "Ask"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default Chat;