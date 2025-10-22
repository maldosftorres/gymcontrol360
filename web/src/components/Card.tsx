import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon: IconComponent, trend, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}>
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">{value}</dd>
                        </dl>
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center">
                        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span className="font-medium">
                                {Math.abs(trend.value)}%
                            </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs mes anterior</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;