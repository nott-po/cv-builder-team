interface PageHeaderProps {
    title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    return (
        <div className="px-6 pt-3 pb-3">
            <h1 className="text-title text-basic-text tracking-standard font-medium">{title}</h1>
        </div>
    );
}
