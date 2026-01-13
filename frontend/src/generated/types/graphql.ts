export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CleaningTask = {
  __typename?: 'CleaningTask';
  createdAt: Scalars['DateTime']['output'];
  customIntervalDays?: Maybe<Scalars['Int']['output']>;
  cycleType: CycleType;
  description?: Maybe<Scalars['String']['output']>;
  estimatedMinutes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lastCompletedAt?: Maybe<Scalars['DateTime']['output']>;
  nextScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  roomId: Scalars['String']['output'];
  skipCount: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type CompleteTaskInput = {
  attachmentUrl?: InputMaybe<Scalars['String']['input']>;
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  status: TaskStatus;
  taskId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateCleaningTaskInput = {
  customIntervalDays?: InputMaybe<Scalars['Int']['input']>;
  cycleType: CycleType;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedMinutes?: InputMaybe<Scalars['Int']['input']>;
  nextScheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  roomId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateRoomInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** 省略時は USER として作成されます */
  role?: InputMaybe<Role>;
};

/** タスクの周期種別 */
export enum CycleType {
  Custom = 'CUSTOM',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** 部屋をアーカイブする */
  archiveRoom: Room;
  /** タスクの進捗を履歴に記録し、次回予定を更新する */
  completeCleaningTask: CleaningTask;
  /** 掃除タスクを新規作成する */
  createCleaningTask: CleaningTask;
  /** 部屋を新規作成する */
  createRoom: Room;
  /** ユーザーを新規作成する */
  createUser: User;
  /** ユーザーを削除する */
  deleteUser: User;
  /** アーカイブ済みの部屋を復元する */
  restoreRoom: Room;
  /** タスクの設定を更新する */
  updateCleaningTask: CleaningTask;
  /** 部屋の表示設定や名称を更新する */
  updateRoom: Room;
  /** ユーザー情報を更新する */
  updateUser: User;
};


export type MutationArchiveRoomArgs = {
  roomId: Scalars['String']['input'];
};


export type MutationCompleteCleaningTaskArgs = {
  input: CompleteTaskInput;
};


export type MutationCreateCleaningTaskArgs = {
  data: CreateCleaningTaskInput;
};


export type MutationCreateRoomArgs = {
  data: CreateRoomInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationRestoreRoomArgs = {
  roomId: Scalars['String']['input'];
};


export type MutationUpdateCleaningTaskArgs = {
  data: UpdateCleaningTaskInput;
  taskId: Scalars['String']['input'];
};


export type MutationUpdateRoomArgs = {
  data: UpdateRoomInput;
  roomId: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** 部屋に紐づく掃除タスクを取得する */
  cleaningTasks: Array<CleaningTask>;
  /** ユーザーの部屋一覧を取得する */
  rooms: Array<Room>;
  /** ID で単一ユーザーを取得する */
  user?: Maybe<User>;
  /** ユーザー一覧を取得する */
  users: Array<User>;
};


export type QueryCleaningTasksArgs = {
  roomId: Scalars['String']['input'];
};


export type QueryRoomsArgs = {
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<RoomSort>;
  userId: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** ユーザーが持つ権限ロール */
export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Room = {
  __typename?: 'Room';
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

/** 部屋一覧のソート条件 */
export enum RoomSort {
  LastActivity = 'LAST_ACTIVITY',
  Name = 'NAME'
}

/** タスク履歴のステータス */
export enum TaskStatus {
  Delayed = 'DELAYED',
  Done = 'DONE',
  Skipped = 'SKIPPED'
}

export type UpdateCleaningTaskInput = {
  customIntervalDays?: InputMaybe<Scalars['Int']['input']>;
  cycleType?: InputMaybe<CycleType>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedMinutes?: InputMaybe<Scalars['Int']['input']>;
  nextScheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoomInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};
