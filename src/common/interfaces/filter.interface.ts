export interface BookFilter {
  title?: string;
  author?: string;
  ISBN?: string;
  isAvailable?: boolean;
}

export interface StudentFilter {
  name?: string;
  matricNumber?: string;
  level?: string;
  department?: string;
}

export interface BorrowedBookFilter {
  borrowDate?: string;
  returnDate?: string;
  studentName?: string;
  studentMatricNo?: string;
  title?: string;
  isReturned?: boolean;
  ISBN?: string;
  author?: string;
}
