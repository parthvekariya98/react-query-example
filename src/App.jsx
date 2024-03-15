import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import TaskList from './TaskList';

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TaskList />
        </QueryClientProvider>
    );
};

export { App, queryClient };