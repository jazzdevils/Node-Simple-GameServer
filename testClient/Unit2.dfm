object Form2: TForm2
  Left = 0
  Top = 0
  Caption = 'Form2'
  ClientHeight = 637
  ClientWidth = 880
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object Label16: TLabel
    Left = 53
    Top = 38
    Width = 34
    Height = 13
    Caption = 'q_type'
  end
  object Label17: TLabel
    Left = 303
    Top = 134
    Width = 93
    Height = 13
    Caption = 'Quiz_Channel_ID : '
  end
  object Label18: TLabel
    Left = 303
    Top = 158
    Width = 65
    Height = 13
    Caption = 'Quiz_Index : '
  end
  object Label19: TLabel
    Left = 325
    Top = 245
    Width = 71
    Height = 25
    Caption = 'Time : '
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -21
    Font.Name = 'Tahoma'
    Font.Style = [fsBold]
    ParentFont = False
  end
  object Memo1: TMemo
    Left = 469
    Top = 8
    Width = 393
    Height = 529
    ScrollBars = ssVertical
    TabOrder = 0
  end
  object Button1: TButton
    Left = 303
    Top = 14
    Width = 75
    Height = 25
    Caption = 'Connect'
    TabOrder = 1
    OnClick = Button1Click
  end
  object Button3: TButton
    Left = 303
    Top = 42
    Width = 75
    Height = 25
    Caption = 'disconnect'
    TabOrder = 2
    OnClick = Button3Click
  end
  object Button4: TButton
    Left = 106
    Top = 566
    Width = 75
    Height = 25
    Caption = 'arrange'
    TabOrder = 3
    OnClick = Button4Click
  end
  object Button5: TButton
    Left = 25
    Top = 566
    Width = 75
    Height = 25
    Caption = 'adduserinfo'
    TabOrder = 4
    OnClick = Button5Click
  end
  object Button2: TButton
    Left = 187
    Top = 566
    Width = 75
    Height = 25
    Caption = 'playerinfo'
    TabOrder = 5
    OnClick = Button2Click
  end
  object Button6: TButton
    Left = 303
    Top = 80
    Width = 75
    Height = 25
    Caption = '1:1 battle'
    Enabled = False
    TabOrder = 6
    OnClick = Button6Click
  end
  object GroupBox1: TGroupBox
    Left = 8
    Top = 73
    Width = 289
    Height = 464
    Caption = 'User info'
    TabOrder = 7
    object Label2: TLabel
      Left = 27
      Top = 199
      Width = 66
      Height = 13
      Caption = 'connection_id'
    end
    object Label3: TLabel
      Left = 14
      Top = 231
      Width = 88
      Height = 13
      Caption = 'competition_count'
    end
    object Label4: TLabel
      Left = 44
      Top = 253
      Width = 49
      Height = 13
      Caption = 'win_count'
    end
    object Label5: TLabel
      Left = 43
      Top = 280
      Width = 50
      Height = 13
      Caption = 'lost_count'
    end
    object Label6: TLabel
      Left = 48
      Top = 308
      Width = 45
      Height = 13
      Caption = 'tie_count'
    end
    object Label7: TLabel
      Left = 39
      Top = 334
      Width = 54
      Height = 13
      Caption = 'level_name'
    end
    object Label8: TLabel
      Left = 16
      Top = 91
      Width = 86
      Height = 13
      Caption = 'q_subcategory_id'
    end
    object Label9: TLabel
      Left = 45
      Top = 118
      Width = 48
      Height = 13
      Caption = 'play_type'
    end
    object Label10: TLabel
      Left = 53
      Top = 150
      Width = 8
      Height = 13
      Caption = 'id'
    end
    object Label11: TLabel
      Left = 53
      Top = 172
      Width = 26
      Height = 13
      Caption = 'name'
    end
    object Label12: TLabel
      Left = 18
      Top = 61
      Width = 69
      Height = 13
      Caption = 'q_category_id'
    end
    object Label13: TLabel
      Left = 50
      Top = 356
      Width = 24
      Height = 13
      Caption = 'point'
    end
    object Label14: TLabel
      Left = 53
      Top = 38
      Width = 34
      Height = 13
      Caption = 'q_type'
    end
    object Label1: TLabel
      Left = 42
      Top = 383
      Width = 51
      Height = 13
      Caption = 'picture_url'
    end
    object Edit1: TEdit
      Left = 107
      Top = 61
      Width = 121
      Height = 21
      TabOrder = 0
      Text = '1'
    end
    object Edit2: TEdit
      Left = 107
      Top = 88
      Width = 121
      Height = 21
      TabOrder = 1
      Text = '1'
    end
    object Edit3: TEdit
      Left = 107
      Top = 115
      Width = 121
      Height = 21
      TabOrder = 2
      Text = '1'
    end
    object Edit4: TEdit
      Left = 107
      Top = 142
      Width = 121
      Height = 21
      TabOrder = 3
      Text = '1'
    end
    object Edit5: TEdit
      Left = 107
      Top = 169
      Width = 121
      Height = 21
      TabOrder = 4
      Text = 'name1'
    end
    object Edit7: TEdit
      Left = 107
      Top = 196
      Width = 121
      Height = 21
      TabOrder = 5
    end
    object Edit8: TEdit
      Left = 107
      Top = 223
      Width = 121
      Height = 21
      TabOrder = 6
      Text = '99'
    end
    object Edit9: TEdit
      Left = 107
      Top = 250
      Width = 121
      Height = 21
      TabOrder = 7
      Text = '45'
    end
    object Edit10: TEdit
      Left = 107
      Top = 277
      Width = 121
      Height = 21
      TabOrder = 8
      Text = '52'
    end
    object Edit11: TEdit
      Left = 107
      Top = 304
      Width = 121
      Height = 21
      TabOrder = 9
      Text = '2'
    end
    object Edit12: TEdit
      Left = 107
      Top = 331
      Width = 121
      Height = 21
      TabOrder = 10
      Text = 'Bignner'
    end
    object Edit13: TEdit
      Left = 107
      Top = 353
      Width = 121
      Height = 21
      TabOrder = 11
      Text = '345'
    end
    object Edit14: TEdit
      Left = 107
      Top = 38
      Width = 121
      Height = 21
      TabOrder = 12
      Text = '4'
    end
    object Edit6: TEdit
      Left = 107
      Top = 380
      Width = 174
      Height = 21
      TabOrder = 13
      Text = 'http://www.google.com/a.jpg'
    end
  end
  object RadioGroup1: TRadioGroup
    Left = 8
    Top = 8
    Width = 289
    Height = 59
    Caption = 'Connect'
    ItemIndex = 0
    Items.Strings = (
      'Local server(127.0.0.1 - 5027)'
      'Remote server(54.186.222.206 - 5027)')
    TabOrder = 8
  end
  object Button7: TButton
    Left = 268
    Top = 566
    Width = 75
    Height = 25
    Caption = 'getquiz'
    TabOrder = 9
    OnClick = Button7Click
  end
  object Button8: TButton
    Left = 360
    Top = 566
    Width = 75
    Height = 25
    Caption = 'get quiz'
    TabOrder = 10
    OnClick = Button8Click
  end
  object Button9: TButton
    Left = 447
    Top = 566
    Width = 75
    Height = 25
    Caption = 'playReady'
    TabOrder = 11
    OnClick = Button9Click
  end
  object Button11: TButton
    Left = 303
    Top = 186
    Width = 31
    Height = 25
    Caption = '1'
    Enabled = False
    TabOrder = 12
    OnClick = Button11Click
  end
  object Button12: TButton
    Left = 338
    Top = 186
    Width = 31
    Height = 25
    Caption = '2'
    Enabled = False
    TabOrder = 13
    OnClick = Button11Click
  end
  object Button13: TButton
    Left = 375
    Top = 186
    Width = 31
    Height = 25
    Caption = '3'
    Enabled = False
    TabOrder = 14
    OnClick = Button11Click
  end
  object Button14: TButton
    Left = 412
    Top = 186
    Width = 31
    Height = 25
    Caption = '4'
    Enabled = False
    TabOrder = 15
    OnClick = Button11Click
  end
  object Button10: TButton
    Left = 544
    Top = 566
    Width = 75
    Height = 25
    Caption = 'playresult'
    TabOrder = 16
    OnClick = Button10Click
  end
  object Timer1: TTimer
    Enabled = False
    OnTimer = Timer1Timer
    Left = 408
    Top = 480
  end
  object ClientSocket1: TClientSocket
    Active = False
    ClientType = ctNonBlocking
    Host = '50.112.141.141'
    Port = 5027
    OnConnect = ClientSocket1Connect
    OnDisconnect = ClientSocket1Disconnect
    OnRead = ClientSocket1Read
    Left = 223
    Top = 110
  end
end
