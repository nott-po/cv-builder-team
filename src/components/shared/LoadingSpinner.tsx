type LoadingSpinnerProps = {
    message: string;
};

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
    return (
        <div className="text-text-secondary text-body flex items-center justify-center py-20">
            {message}
        </div>
    );
}
