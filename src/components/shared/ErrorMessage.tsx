type ErrorMessageProps = {
    message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="text-destructive text-body flex items-center justify-center py-20">
            {message}
        </div>
    );
}
