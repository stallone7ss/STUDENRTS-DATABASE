/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const VBA_MOD_MAPPING = `Option Compare Database
Option Explicit

' ==============================================================================
' Module Name: modMapping
' Purpose: Geographical Address Resolution, Map URL Generation, and Browser
'          Navigation for Student and Guardian Residential Locations.
' Template: Microsoft Access Student Management Solution Architecture
' ==============================================================================

' API Declaration for ShellExecute to open external browser / Google Maps
#If VBA7 Then
    Private Declare PtrSafe Function ShellExecute Lib "shell32.dll" Alias "ShellExecuteA" ( _
        ByVal hwnd As LongPtr, _
        ByVal lpOperation As String, _
        ByVal lpFile As String, _
        ByVal lpParameters As String, _
        ByVal lpDirectory As String, _
        ByVal nShowCmd As Long) As LongPtr
#Else
    Private Declare Function ShellExecute Lib "shell32.dll" Alias "ShellExecuteA" ( _
        ByVal hwnd As Long, _
        ByVal lpOperation As String, _
        ByVal lpFile As String, _
        ByVal lpParameters As String, _
        ByVal lpDirectory As String, _
        ByVal nShowCmd As Long) As Long
#End If

Private Const SW_SHOWNORMAL As Long = 1
Private Const DEFAULT_MAP_URL As String = "https://www.google.com/maps/search/?api=1&query="

''' <summary>
''' Builds a formatted full address string from individual address components.
''' </summary>
Public Function FormatAddress( _
    ByVal StreetAddress As Variant, _
    ByVal City As Variant, _
    ByVal State As Variant, _
    ByVal ZipCode As Variant, _
    Optional ByVal Country As Variant = "USA") As String

    Dim strFullAddress As String
    strFullAddress = ""

    If Not IsNull(StreetAddress) And Trim(StreetAddress & "") <> "" Then
        strFullAddress = Trim(StreetAddress)
    End If

    If Not IsNull(City) And Trim(City & "") <> "" Then
        If Len(strFullAddress) > 0 Then strFullAddress = strFullAddress & ", "
        strFullAddress = strFullAddress & Trim(City)
    End If

    If Not IsNull(State) And Trim(State & "") <> "" Then
        If Len(strFullAddress) > 0 Then strFullAddress = strFullAddress & ", "
        strFullAddress = strFullAddress & Trim(State)
    End If

    If Not IsNull(ZipCode) And Trim(ZipCode & "") <> "" Then
        If Len(strFullAddress) > 0 Then strFullAddress = strFullAddress & " "
        strFullAddress = strFullAddress & Trim(ZipCode)
    End If

    If Not IsNull(Country) And Trim(Country & "") <> "" And UCase(Trim(Country)) <> "USA" Then
        If Len(strFullAddress) > 0 Then strFullAddress = strFullAddress & ", "
        strFullAddress = strFullAddress & Trim(Country)
    End If

    FormatAddress = strFullAddress
End Function

''' <summary>
''' URL-encodes a raw string for safe transmission in HTTP query parameters.
''' </summary>
Public Function URLEncode(ByVal StringVal As String) As String
    Dim i As Long
    Dim charCode As Integer
    Dim char As String
    Dim result As String

    result = ""
    For i = 1 To Len(StringVal)
        char = Mid$(StringVal, i, 1)
        charCode = Asc(char)

        Select Case charCode
            Case 48 To 57, 65 To 90, 97 To 122 ' 0-9, A-Z, a-z
                result = result & char
            Case 32 ' Space
                result = result & "+"
            Case 45, 46, 95, 126 ' - . _ ~
                result = result & char
            Case Else
                result = result & "%" & Right$("0" & Hex$(charCode), 2)
        End Select
    Next i

    URLEncode = result
End Function

''' <summary>
''' Retrieves the configured Map Provider URL from the Settings table.
''' Falls back to Google Maps Search API if not present.
''' </summary>
Public Function GetMapProviderBaseURL() As String
    On Error GoTo ErrHandler
    Dim strURL As Variant

    strURL = DLookup("[Setting Value]", "[Settings]", "[Setting Name] = 'MapProviderUrl'")
    If Not IsNull(strURL) And Len(Trim(strURL)) > 0 Then
        GetMapProviderBaseURL = Trim(strURL)
    Else
        GetMapProviderBaseURL = DEFAULT_MAP_URL
    End If
    Exit Function

ErrHandler:
    GetMapProviderBaseURL = DEFAULT_MAP_URL
End Function

''' <summary>
''' Constructs the complete HTTP request URL to map a given physical address.
''' </summary>
Public Function BuildMapURL( _
    ByVal StreetAddress As Variant, _
    ByVal City As Variant, _
    ByVal State As Variant, _
    ByVal ZipCode As Variant, _
    Optional ByVal Country As Variant = "USA") As String

    Dim strAddress As String
    strAddress = FormatAddress(StreetAddress, City, State, ZipCode, Country)

    If Len(strAddress) = 0 Then
        BuildMapURL = ""
        Exit Function
    End If

    BuildMapURL = GetMapProviderBaseURL() & URLEncode(strAddress)
End Function

''' <summary>
''' Opens the system default browser or embedded browser control to display
''' the map coordinates for a student or guardian record.
''' </summary>
Public Sub ShowMapForAddress( _
    ByVal StreetAddress As Variant, _
    ByVal City As Variant, _
    ByVal State As Variant, _
    ByVal ZipCode As Variant, _
    Optional ByVal Country As Variant = "USA")

    Dim strURL As String
    strURL = BuildMapURL(StreetAddress, City, State, ZipCode, Country)

    If Len(strURL) = 0 Then
        MsgBox "No valid address information available to map.", vbInformation, "Map Address"
        Exit Sub
    End If

    ' Method 1: FollowHyperlink (Native Access)
    On Error Resume Next
    Application.FollowHyperlink strURL
    If Err.Number <> 0 Then
        ' Method 2: Fallback to ShellExecute API
        Err.Clear
        ShellExecute 0, "open", strURL, vbNullString, vbNullString, SW_SHOWNORMAL
    End If
End Sub
`;

export interface MacroAction {
  actionName: string;
  arguments: Record<string, string>;
  comment: string;
}

export interface MacroDefinition {
  name: string;
  purpose: string;
  trigger: string;
  actions: MacroAction[];
  vbaEquivalent: string;
}

export const ACCESS_MACROS: MacroDefinition[] = [
  {
    name: "AutoExec",
    purpose: "Executes automatically when the database opens. Initializes system environment, verifies database settings, sets application title, and loads the Welcome splash form.",
    trigger: "Database Initialization (OpenCurrentDatabase event)",
    actions: [
      {
        actionName: "Echo",
        arguments: { EchoOn: "No", StatusMessage: "Loading Student Management System..." },
        comment: "Suppresses screen repaint during startup initialization"
      },
      {
        actionName: "SetWarnings",
        arguments: { WarningsOn: "No" },
        comment: "Disables standard Access action query warnings"
      },
      {
        actionName: "RunCode",
        arguments: { FunctionName: "InitializeSystemSettings()" },
        comment: "Executes VBA configuration checks from Settings table"
      },
      {
        actionName: "OpenForm",
        arguments: { FormName: "Welcome", View: "Form", WindowMode: "Normal" },
        comment: "Opens the Welcome / Launchpad navigation form"
      },
      {
        actionName: "SetWarnings",
        arguments: { WarningsOn: "Yes" },
        comment: "Restores standard system safety warnings"
      },
      {
        actionName: "Echo",
        arguments: { EchoOn: "Yes" },
        comment: "Restores screen repainting"
      }
    ],
    vbaEquivalent: `Public Sub AutoExec_Procedure()
    On Error GoTo ErrorHandler
    DoCmd.Echo False, "Loading Student Management System..."
    DoCmd.SetWarnings False
    
    ' Validate settings exist
    If IsNull(DLookup("[Setting Value]", "[Settings]", "[Setting Name] = 'InstitutionName'")) Then
        MsgBox "Warning: System settings not configured.", vbExclamation, "Initialization"
    End If
    
    ' Launch startup form
    DoCmd.OpenForm "Welcome", acNormal
    
ExitProc:
    DoCmd.SetWarnings True
    DoCmd.Echo True
    Exit Sub
ErrorHandler:
    MsgBox "Error initializing database: " & Err.Description, vbCritical
    Resume ExitProc
End Sub`
  },
  {
    name: "Filters",
    purpose: "Handles client-side filtering on the Student List form when the user selects a Level, Room, or toggles Special Circumstances.",
    trigger: "AfterUpdate event on Filter dropdowns / checkboxes in Student List",
    actions: [
      {
        actionName: "SetLocalVar",
        arguments: { Name: "strWhere", Expression: "BuildFilterCriteria()" },
        comment: "Concatenates active filter conditions (e.g. Level = 'Grade 10' AND Room = 'Room 102')"
      },
      {
        actionName: "ApplyFilter",
        arguments: { FilterName: "", WhereCondition: "=[LocalVars]![strWhere]" },
        comment: "Applies the WHERE condition dynamically to the active form recordset"
      },
      {
        actionName: "Requery",
        arguments: { ControlName: "" },
        comment: "Refreshes data count and record selector indicators"
      }
    ],
    vbaEquivalent: `Private Sub ApplyFilters_Procedure()
    Dim strFilter As String
    strFilter = ""

    If Not IsNull(Me.cboLevel) And Me.cboLevel <> "" Then
        strFilter = "[Level] = '" & Replace(Me.cboLevel, "'", "''") & "'"
    End If

    If Not IsNull(Me.cboRoom) And Me.cboRoom <> "" Then
        If Len(strFilter) > 0 Then strFilter = strFilter & " AND "
        strFilter = strFilter & "[Room] = '" & Replace(Me.cboRoom, "'", "''") & "'"
    End If

    If Me.chkSpecialCircumstances = True Then
        If Len(strFilter) > 0 Then strFilter = strFilter & " AND "
        strFilter = strFilter & "[Special Circumstances] = True"
    End If

    Me.Filter = strFilter
    Me.FilterOn = (Len(strFilter) > 0)
    Me.Requery
End Sub`
  },
  {
    name: "Search",
    purpose: "Provides live incremental text search across Student ID, First Name, Last Name, and Email Address.",
    trigger: "OnChange or AfterUpdate event of the search textbox (txtSearch) on Student List",
    actions: [
      {
        actionName: "If",
        arguments: { Condition: "IsNull([Screen]![ActiveControl]) Or [Screen]![ActiveControl] = \"\"" },
        comment: "Checks if the search input has been cleared"
      },
      {
        actionName: "ShowAllRecords",
        arguments: {},
        comment: "Removes search filtering if query is empty"
      },
      {
        actionName: "Else",
        arguments: {},
        comment: "Applies wildcard pattern match across text columns"
      },
      {
        actionName: "ApplyFilter",
        arguments: {
          WhereCondition: "([Student ID] Like \"*\" & [Screen]![ActiveControl] & \"*\") OR ([First Name] Like \"*\" & [Screen]![ActiveControl] & \"*\") OR ([Last Name] Like \"*\" & [Screen]![ActiveControl] & \"*\") OR ([E-mail Address] Like \"*\" & [Screen]![ActiveControl] & \"*\")"
        },
        comment: "Filters the datasheet instantly based on search term"
      },
      {
        actionName: "End If",
        arguments: {},
        comment: "Ends conditional branch"
      }
    ],
    vbaEquivalent: `Private Sub txtSearch_Change()
    Dim strSearch As String
    strSearch = Nz(Me.txtSearch.Text, "")

    If Len(Trim(strSearch)) = 0 Then
        Me.Filter = ""
        Me.FilterOn = False
    Else
        Dim strEscaped As String
        strEscaped = Replace(strSearch, "'", "''")
        Me.Filter = "([Student ID] LIKE '*" & strEscaped & "*') OR " & _
                    "([First Name] LIKE '*" & strEscaped & "*') OR " & _
                    "([Last Name] LIKE '*" & strEscaped & "*') OR " & _
                    "([E-mail Address] LIKE '*" & strEscaped & "*')"
        Me.FilterOn = True
    End If
End Sub`
  }
];
